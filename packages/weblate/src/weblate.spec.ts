import { beforeAll, describe, expect, test } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import {
  WEBLATE_API_ROOT_URL,
  WEBLATE_API_ENDPOINT_ROOT,
  WEBLATE_PROJECT_SLUG,
  FILE_FORMAT,
  UploadMethod,
  createProject,
  createLanguage,
  createComponentsTranslations,
  createTranslationComponentWithFile,
  createTranslationComponent,
  getTranslationComponent,
  uploadFileWithTranslations,
  deleteTranslateComponent,
  downloadLanguageFile,
  maintainVCS,
  listAllComponents,
  getTranslationComponentStatistics,
  addTranslationUnit,
  getTranslationsSource,
  getTranslationsUnit,
  getComponentsTranslations,
  patchTranslationUnit,
} from './weblate';

enum Locale {
  EN = 'en',
  ZH_TW = 'zh_Hant',
}

// tests run against hosted.weblate and could potentially hit rate limit, resulting in IP block.
describe('@api weblate', () => {
  beforeAll(async () => {
    const result = await deleteTranslateComponent({
      projectSlug: WEBLATE_PROJECT_SLUG,
      slug: 'demo',
    }).catch(() => null);
  });

  // for hosted, stuck at serialization error

  test(
    '#createTranslationComponentWithFile and #deleteTranslateComponent',
    async () => {
      const filePath = path.resolve(__dirname, './demo.fixture.txt');
      const docFile = fs.readFileSync(filePath);
      const result = await createTranslationComponentWithFile({
        projectSlug: WEBLATE_PROJECT_SLUG,
        name: 'demo',
        slug: 'demo',
        docFile,
        // docFileStream: fs.createReadStream(
        //   path.resolve(__dirname, './demo.fixture.txt'),
        // ),
      });
      console.log(result);

      // expect(result.webUrl).toEqual(
      //   `${WEBLATE_API_ROOT_URL}/projects/${WEBLATE_PROJECT_SLUG}/demo/`,
      // );

      // const createComponentsTranslationsResult =
      //   await createComponentsTranslations({
      //     projectSlug: WEBLATE_PROJECT_SLUG,
      //     slug: 'demo',
      //     locale: Locale.ZH_TW,
      //   });
      // expect(createComponentsTranslationsResult.data.language_code).toEqual(
      //   Locale.ZH_TW,
      // );

      // const deleteResult = await deleteTranslateComponent({
      //   projectSlug: WEBLATE_PROJECT_SLUG,
      //   slug: 'demo',
      // });
      // expect(deleteResult).toEqual('');
    },
    5 * 60 * 1000,
  );

  test('#listAllComponents page 1', async () => {
    const {
      count,
      next,
      previous,
      results: allComponents,
    } = await listAllComponents(WEBLATE_PROJECT_SLUG);
    console.log(JSON.stringify(allComponents, null, 4));
    expect(allComponents.length === 20).toEqual(true);
    expect(!!next.match(/page=/)).toEqual(true);
    expect(count > allComponents.length).toEqual(true);
  });

  test('#listAllComponents page 3', async () => {
    const {
      count,
      next,
      previous,
      results: allComponents,
    } = await listAllComponents(WEBLATE_PROJECT_SLUG, 3);
    console.log(JSON.stringify(allComponents, null, 4));

    expect(allComponents.length > 0).toEqual(true);
    // check if last
    // expect(!!next.match(/page=/)).toEqual(false);
    expect(count > allComponents.length).toEqual(true);
  });

  test(
    '#downloadLanguageFile',
    async () => {
      const createComponent = await createTranslationComponentWithFile({
        projectSlug: WEBLATE_PROJECT_SLUG,
        name: 'demo',
        slug: 'demo',
        docFileStream: fs.createReadStream(
          path.resolve(__dirname, './demo-subtitle.fixture.srt'),
        ),
      });

      const createComponentsTranslationsResult =
        await createComponentsTranslations({
          projectSlug: WEBLATE_PROJECT_SLUG,
          slug: 'demo',
          locale: Locale.ZH_TW,
        });

      const filePath = path.resolve(
        __dirname,
        '../../../build/demo-subtitle.srt',
      );
      const result = (await downloadLanguageFile({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo',
        locale: 'en',
        filePath,
      })) as any;
      expect(result.filePath).toEqual(filePath);
    },
    5 * 10 * 6000,
  );

  test.skip(
    '#createLanguage',
    async () => {
      const locale = Locale.ZH_TW;
      const params = {
        code: locale,
        name: 'Traditional Chinese',
        direction: 'ltr',
        plural: {
          id: 75,
          source: 0,
          number: 2,
          formula: 'n != 1',
          type: 1,
        },
      };

      const result = await createLanguage(params);

      expect(result.code).toEqual(locale);
    },
    5 * 10 * 6000,
  );

  describe('with project created', () => {
    // beforeAll(async () => {
    //   const deleteResult = await deleteTranslateComponent({
    //     projectSlug: WEBLATE_PROJECT_SLUG,
    //     slug: 'demo',
    //   });
    //   const result = await createTranslationComponentWithFile({
    //     projectSlug: WEBLATE_PROJECT_SLUG,
    //     name: 'demo',
    //     slug: 'demo',
    //     docFileStream: fs.createReadStream(
    //       path.resolve(__dirname, './demo.fixture.json'),
    //     ),
    //   }).catch(() => null);
    //   console.log('create result', result);

    //   // manage_units true
    // }, 60 * 1000);

    test('#getTranslationComponent', async () => {
      const component = {
        name: 'demo',
        slug: 'demo',
      };
      const result = await getTranslationComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        ...component,
      });
      console.log('getTranslationComponent result', result);
      expect(result.url).toEqual(
        `${WEBLATE_API_ENDPOINT_ROOT}/components/${WEBLATE_PROJECT_SLUG}/demo/`,
      );
      expect(result.webUrl).toEqual(
        `${WEBLATE_API_ROOT_URL}/projects/${WEBLATE_PROJECT_SLUG}/demo/`,
      );
    });

    // there is a magic setting "manage strings" to be turn on before this can work
    // Component > settings > translations > Manage Strings
    // https://docs.weblate.org/en/latest/admin/projects.html#manage-strings

    test('#addTranslationUnit working', async () => {
      const currentUnit: any = await getTranslationsUnit({ id: 121374334 });
      console.log('current', currentUnit);

      // error =  results { detail: 'Add the string to the source language instead.' }
      const results = await addTranslationUnit({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'transcript',
        locale: Locale.ZH_TW as unknown as string,
        // 121374334 on crypto
        // 'https://hosted.weblate.org/translate/youtube-Ouml0A3UmLY/transcript/en/?checksum=68c7c9036abd2650'
        key: '121374334',
        source: currentUnit.source,
        target: ['value-new'],
      });
      console.log('results', results);
      expect(results.non_field_errors).toEqual([
        'This string seems to already exist.',
      ]);
    });

    test.only('#patchTranslationUnit working', async () => {
      const currentUnit: any = await getTranslationsUnit({ id: 121374334 });
      console.log('current', currentUnit);

      // error =  results { detail: 'Add the string to the source language instead.' }
      const results = await patchTranslationUnit({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'transcript',
        locale: Locale.ZH_TW as unknown as string,
        // 121374334 on crypto
        // 'https://hosted.weblate.org/translate/youtube-Ouml0A3UmLY/transcript/en/?checksum=68c7c9036abd2650'

        // translation
        // https://hosted.weblate.org/translate/youtube-Ouml0A3UmLY/transcript/zh_Hant/?checksum=68c7c9036abd2650
        id: '121374464',
        target: ['但即使他們對加密貨幣本身一無所知也能使用這些應用程式。'],
      });
      console.log('#patchTranslationUnit results', results);
      expect(results.non_field_errors).toEqual(undefined);
    });

    // set manage strings on
    test(
      '#uploadFileWithTranslations',
      async () => {
        const component = {
          name: 'demo',
          slug: 'demo',
        };

        // use this so manage units is on
        await createTranslationComponent({
          projectSlug: WEBLATE_PROJECT_SLUG,
          ...component,
          fileFormat: FILE_FORMAT,
          filemask: 'messages/common/*.json',
          newBase: 'messages/common/en.json',
        });

        // we will just override file in this repo

        // no error log

        // case of new in translations

        const overrideSourceResult = await uploadFileWithTranslations({
          projectSlug: WEBLATE_PROJECT_SLUG,
          slug: component.slug,
          locale: Locale.EN,
          filePath: path.resolve(__dirname, './demo-override.fixture.json'),
          method: UploadMethod.Add,
        }).catch((err) => {
          console.log(
            'TODO not working, probabl only work if original also file based',
          );
        });
        // expect(overrideSourceResult.count).toEqual(77);

        // const result = await uploadFileWithTranslations({
        //   projectSlug: WEBLATE_PROJECT_SLUG,
        //   slug: component.slug,
        //   locale: Locale.ZH_TW,
        //   filePath: path.resolve(__dirname, './demo-zh-TW.fixture.json')
        // });
        // expect(result.count).toEqual(77);

        // case of new in translations
        // const overrideResult = await uploadFileWithTranslations({
        //   projectSlug: WEBLATE_PROJECT_SLUG,
        //   slug: component.slug,
        //   locale: Locale.ZH_TW,
        //   filePath: path.resolve(__dirname, './demo-zh-TW-override.fixture.json')
        // });
        // expect(overrideResult.count).toEqual(77);
      },
      5 * 10 * 6000,
    );

    test('#getTranslationsSource', async () => {
      const results: any = await getTranslationsSource({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'transcript',
      });
      console.log('results', results);
      // note id, id_hash=content_hash, chechksum in url are different
    });

    test.only('#getComponentsTranslations zh-hant', async () => {
      const results: any = await getComponentsTranslations({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'transcript',
        locale: Locale.ZH_TW,
      });
      console.log(
        'results',
        JSON.stringify(
          results.results.filter((t: any) => t.id === 121374464),
          null,
          4,
        ),
      );
      // note id, id_hash=content_hash, chechksum in url are different
    });
    test('#getTranslationComponentStatistics', async () => {
      const component = {
        name: 'demo',
        slug: 'demo',
      };

      const result = await getTranslationComponentStatistics({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: component.slug,
      });

      expect(result.translated_percent).toEqual(100);
    });
  });

  describe('maintain repo', () => {
    test('#maintainVCS fail if push not available', async () => {
      const component = {
        name: 'demo',
        slug: 'demo',
      };
      const results = await maintainVCS({
        projectSlug: WEBLATE_PROJECT_SLUG,

        operation: 'push',
      });
      expect(results.result).toEqual(false);
    });
  });
});
describe.skip('@prd @data sync', () => {
  // issue at weblate
  // { detail: 'Can not create projects' }
  test('create project', async () => {
    const results = await createProject({
      projectSlug: WEBLATE_PROJECT_SLUG,
      name: WEBLATE_PROJECT_SLUG,
    });
    console.log('results', results);
    expect(!!results.slug).toEqual(WEBLATE_PROJECT_SLUG);
    expect(
      results.url.match(new RegExp(`projects/${WEBLATE_PROJECT_SLUG}`)),
    ).toEqual(true);
  });
});
