import { beforeAll, describe, expect, test } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import {
  WEBLATE_API_ROOT_URL,
  WEBLATE_API_ENDPOINT_ROOT,
  WEBLATE_PROJECT_SLUG,
  WEBLATE_PROJECT_SUBTITLES_SLUG,
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
  addTranslationUnit
} from './weblate';

enum Locale {
  EN,
  ZH_TW
}

// tests run against hosted.weblate and could potentially hit rate limit, resulting in IP block.
describe.skip('@api weblate', () => {
  beforeAll(async () => {
    const result = await deleteTranslateComponent({
      projectSlug: WEBLATE_PROJECT_SLUG,
      slug: 'demo'
    }).catch(() => null);
  });

  test(
    '#createTranslationComponentWithFile and #deleteTranslateComponent',
    async () => {
      const result = await createTranslationComponentWithFile({
        projectSlug: WEBLATE_PROJECT_SLUG,
        name: 'demo',
        slug: 'demo',
        docFileStream: fs.createReadStream(path.resolve(__dirname, './demo.fixture.json'))
      });
      console.log(result);

      expect(result.webUrl).toEqual(`${WEBLATE_API_ROOT_URL}/projects/${WEBLATE_PROJECT_SLUG}/demo/`);

      const createComponentsTranslationsResult = await createComponentsTranslations({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo',
        locale: Locale.ZH_TW
      });
      expect(createComponentsTranslationsResult.data.language_code).toEqual(Locale.ZH_TW);

      const deleteResult = await deleteTranslateComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo'
      });
      expect(deleteResult).toEqual('');
    },
    5 * 60 * 1000
  );

  test('#listAllComponents page 1', async () => {
    const {
      count, next, previous, results: allComponents
    } = await listAllComponents(WEBLATE_PROJECT_SLUG);
    console.log(JSON.stringify(allComponents, null, 4));
    expect(allComponents.length === 20).toEqual(true);
    expect(!!next.match(/page=/)).toEqual(true);
    expect(count > allComponents.length).toEqual(true);
  });

  test('#listAllComponents page 3', async () => {
    const {
      count, next, previous, results: allComponents
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
        docFileStream: fs.createReadStream(path.resolve(__dirname, './demo-subtitle.fixture.srt'))
      });

      const createComponentsTranslationsResult = await createComponentsTranslations({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo',
        locale: Locale.ZH_TW
      });

      const filePath = path.resolve(__dirname, '../../../build/demo-subtitle.srt');
      const result = (await downloadLanguageFile({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo',
        locale: 'en',
        filePath
      })) as any;
      expect(result.filePath).toEqual(filePath);
    },
    5 * 10 * 6000
  );

  test(
    '#createLanguage',
    async () => {
      const locale = Locale.ZH_TW;
      const params = {
        code: locale,
        // TODO  avoid circular deps
        name: 'Traditional Chinese',
        direction: 'ltr',
        plural: {
          id: 75,
          source: 0,
          number: 2,
          formula: 'n != 1',
          type: 1
        }
      };

      const result = await createLanguage(params);

      expect(result.code).toEqual(locale);
    },
    5 * 10 * 6000
  );

  test(
    '#createTranslationComponent standalone',
    async () => {
      const component = {
        name: 'demo',
        slug: 'demo-2'
      };

      await deleteTranslateComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        ...component
      });
      const result = await createTranslationComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        ...component,
        repo: 'git@github.com:wordquest/wq-locales-weblate.git',
        fileFormat: FILE_FORMAT,
        filemask: 'messages/common/*.json',
        newBase: 'messages/common/en.json'
      });
      console.log(result);

      expect(result.webUrl).toEqual(`${WEBLATE_API_ROOT_URL}/projects/${WEBLATE_PROJECT_SLUG}/${component.slug}/`);
      expect(result.manage_units).toEqual(true);
      const deleteResult = await deleteTranslateComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo'
      });
      expect(deleteResult).toEqual('');
    },
    5 * 60 * 1000
  );

  describe('with project created', () => {
    beforeAll(async () => {
      const deleteResult = await deleteTranslateComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: 'demo'
      });
      const result = await createTranslationComponentWithFile({
        projectSlug: WEBLATE_PROJECT_SLUG,
        name: 'demo',
        slug: 'demo',
        docFileStream: fs.createReadStream(path.resolve(__dirname, './demo.fixture.json'))
      }).catch(() => null);
      console.log('create result', result);

      // manage_units true
    }, 60 * 1000);

    test('#getTranslationComponent', async () => {
      const component = {
        name: 'demo',
        slug: 'demo'
      };
      const result = await getTranslationComponent({
        projectSlug: WEBLATE_PROJECT_SLUG,
        ...component
      });
      console.log('getTranslationComponent result', result);
      expect(result.url).toEqual(`${WEBLATE_API_ENDPOINT_ROOT}/components/${WEBLATE_PROJECT_SLUG}/demo/`);
      expect(result.webUrl).toEqual(`${WEBLATE_API_ROOT_URL}/projects/${WEBLATE_PROJECT_SLUG}/demo/`);
    });

    // there is a magic setting "manage strings" to be turn on before this can work
    // Component > settings > translations > Manage Strings
    // https://docs.weblate.org/en/latest/admin/projects.html#manage-strings

    test('#addTranslationUnit working', async () => {
      const results = await addTranslationUnit({
        projectSlug: 'wq-locales-weblate',
        slug: 'wq-locales-tag',
        locale: Locale.EN,
        key: 'kkkfdsafds',
        source: ['tag abc'],
        target: ['value-new']
      });
      console.log('results', results);
      expect(results.non_field_errors).toEqual(['This string seems to already exist.']);
    });

    test('#addTranslationUnit not working', async () => {
      const results = await addTranslationUnit({
        projectSlug: 'wq-locales-weblate',
        slug: 'demo',
        locale: Locale.ZH_TW,
        key: 'abcdef',
        source: ['tag abc'],
        target: ['value-new']
      });
      expect(results.detail).toEqual('Can not add  unit');
    });

    // set manage strings on
    test(
      '#uploadFileWithTranslations',
      async () => {
        const component = {
          name: 'demo',
          slug: 'demo'
        };

        // use this so manage units is on
        await createTranslationComponent({
          projectSlug: WEBLATE_PROJECT_SLUG,
          ...component,
          repo: 'git@github.com:wordquest/wq-locales-weblate.git',
          fileFormat: FILE_FORMAT,
          filemask: 'messages/common/*.json',
          newBase: 'messages/common/en.json'
        });

        // we will just override file in this repo

        // no error log

        // case of new in translations

        const overrideSourceResult = await uploadFileWithTranslations({
          projectSlug: WEBLATE_PROJECT_SLUG,
          slug: component.slug,
          locale: Locale.EN,
          filePath: path.resolve(__dirname, './demo-override.fixture.json'),
          method: UploadMethod.Add
        }).catch((err) => {
          console.log('TODO not working, probabl only work if original also file based');
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
      5 * 10 * 6000
    );

    test('#getTranslationComponentStatistics', async () => {
      const component = {
        name: 'demo',
        slug: 'demo'
      };

      const result = await getTranslationComponentStatistics({
        projectSlug: WEBLATE_PROJECT_SLUG,
        slug: component.slug
      });

      expect(result.translated_percent).toEqual(100);
    });
  });

  describe('maintain repo', () => {
    test('#maintainVCS fail if push not available', async () => {
      const component = {
        name: 'demo',
        slug: 'demo'
      };
      const results = await maintainVCS({
        projectSlug: WEBLATE_PROJECT_SLUG,

        operation: 'push'
      });
      expect(results.result).toEqual(false);
    });
  });
});
describe.skip('@prd @data sync', () => {
  test('create project', async () => {
    const results = await createProject({
      projectSlug: WEBLATE_PROJECT_SLUG,
      name: WEBLATE_PROJECT_SLUG
    });
    console.log('results', results);
    expect(!!results.slug).toEqual(WEBLATE_PROJECT_SLUG);
    expect(results.url.match(new RegExp(`projects/${WEBLATE_PROJECT_SLUG}`))).toEqual(true);
  });

  test(
    'remove tests',
    async () => {
      const results = await Promise.all(
        ['wq-locales-video'].map(slug => deleteTranslateComponent({
          projectSlug: WEBLATE_PROJECT_SLUG,
          slug
        })
        )
      );
      console.log('delete results', results);
      expect(typeof results[0] === 'string').toEqual(true);
    },
    5 * 10 * 6000
  );
});
