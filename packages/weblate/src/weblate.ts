import * as _ from 'lodash';
import got from 'got';
import fs, { ReadStream } from 'fs';
import path from 'path';
import { FormData, File } from 'formdata-node';
export const DEFAULT_WEBLATE_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Token ${process.env.WEBLATE_API_KEY}`,
};

export const WEBLATE_PROJECT_SLUG = 'youtube-Ouml0A3UmLY';
export const WEBLATE_API_ROOT_URL =
  process.env.WEBLATE_API_ROOT_URL || 'https://hosted.weblate.org';
export const WEBLATE_API_ENDPOINT_ROOT = `${WEBLATE_API_ROOT_URL}/api`;
export const WEBLATE_EMAIL = 'els@debuggingfuture.com';
// same as username
export const WEBLATE_AUTHOR = 'elsdebuggingfuture';

export const FILE_FORMAT = 'i18next';

// TODO ensure trailing
export const createWeblateApiEndpoint = (endpoint: string) => {
  const effectiveEndpoint = endpoint.replace(/\/$/, '').replace(/^\//, '');

  return `${WEBLATE_API_ENDPOINT_ROOT}/${effectiveEndpoint}/`;
};

// https://docs.weblate.org/en/latest/api.html#post--api-projects-
export const createProject = ({
  name,
  projectSlug,
}: {
  name: string;
  projectSlug: string;
}) =>
  fetch(`${WEBLATE_API_ENDPOINT_ROOT}/projects/`, {
    method: 'POST',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
    // @ts-ignore
    body: JSON.stringify({
      name,
      slug: projectSlug,
      web: WEBLATE_API_ENDPOINT_ROOT,
    }),
  }).then((res) => res.json());

// https://docs.weblate.org/en/latest/api.html#get--api-projects-
export const getAllProjects = () =>
  fetch(`${WEBLATE_API_ENDPOINT_ROOT}/projects/`, {
    method: 'GET',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
  })
    .then((res) => res.json())
    .then((data) => data.results);

// https://docs.weblate.org/en/latest/api.html#get--api-projects-(string-project)-
export const getDetailProject = (projectSlug: string) =>
  fetch(`${WEBLATE_API_ENDPOINT_ROOT}/projects/${projectSlug}`, {
    method: 'GET',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
  }).then((res) => res.json());

// 7. API https://docs.weblate.org/en/latest/api.html#post--api-languages-
export const createLanguage = ({
  code,
  name,
  direction = 'ltr',
  plural = {},
}) =>
  fetch(`${WEBLATE_API_ENDPOINT_ROOT}/languages/`, {
    method: 'POST',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
    // @ts-ignore
    body: JSON.stringify({
      code,
      name,
      direction,
      plural,
    }),
  }).then((response) => response.json());

export const deleteTranslateComponent = async ({ projectSlug, slug }) =>
  fetch(`${WEBLATE_API_ENDPOINT_ROOT}/components/${projectSlug}/${slug}/`, {
    method: 'DELETE',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
  }).then((res) => res.text());

export enum UploadMethod {
  Translate = 'translate',
  Add = 'add',
}

export const uploadFileWithTranslations = ({
  projectSlug,
  slug,
  locale,
  filePath,
  method = UploadMethod.Translate,
}) => {
  const fileUpload = fs.createReadStream(filePath);

  const form = new FormData();

  // (ignore, replace-translated or replace-approved)
  form.set('conflicts', 'ignore');
  form.set('file', fileUpload);
  form.set('email', WEBLATE_EMAIL);
  form.set('method', method);
  form.set('author', WEBLATE_AUTHOR);
  // form.append('fuzzy', 'approve');

  const weblateLocale = locale;

  return fetch(
    `${WEBLATE_API_ENDPOINT_ROOT}/components/${projectSlug}/${slug}/${weblateLocale}/file/`,
    {
      method: 'POST',
      headers: {
        ..._.omit(DEFAULT_WEBLATE_HEADERS, 'Content-Type'),
      },
      // @ts-ignore
      body: form,
    },
  ).then((response) => response.json());
};

export const listAllComponents = (
  projectSlug: string,
  page = 1,
): Promise<{
  count: number;
  next: string;
  previous: string;
  results: unknown[];
}> =>
  fetch(
    `${WEBLATE_API_ENDPOINT_ROOT}/projects/${projectSlug}/components/?page=${page}`,
    {
      method: 'GET',
      headers: {
        ...DEFAULT_WEBLATE_HEADERS,
      },
    },
  ).then((res) => res.json());

// For non-VCS
export const createTranslationComponentWithFile = ({
  projectSlug,
  name,
  slug,
  docFile,
  docFileStream,
}: {
  projectSlug: string;
  name: string;
  slug: string;
  docFile?: Buffer;
  docFileStream?: ReadStream;
}): Promise<any> => {
  const form = new FormData();
  // const type = _.last(docFileStream.path.toString().split('.'));

  form.set('name', name);
  form.set('slug', slug);
  form.set('file_format', 'txt');
  // form.append('new_lang', 'add');
  // weblate missing .vtt support, use .txt for now

  const file = new File([docFile?.toString()], 'file.txt');
  form.set('docfile', file);

  return got
    .post(`${WEBLATE_API_ENDPOINT_ROOT}/projects/${projectSlug}/components/`, {
      body: form,
      headers: {
        // ...DEFAULT_WEBLATE_HEADERS,
        ..._.omit(DEFAULT_WEBLATE_HEADERS, 'Content-Type'),
      },
    })
    .json();
};

export const getTranslationComponent = ({ projectSlug, slug }) =>
  fetch(`${WEBLATE_API_ENDPOINT_ROOT}/components/${projectSlug}/${slug}/`, {
    method: 'GET',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
  }).then((res) => res.json());

// "enable" language for project
// incorrect api endpoint example /translations
export const createComponentsTranslations = ({ projectSlug, slug, locale }) =>
  fetch(
    `${WEBLATE_API_ENDPOINT_ROOT}/components/${projectSlug}/${slug}/translations/`,
    {
      method: 'POST',
      headers: {
        ...DEFAULT_WEBLATE_HEADERS,
      },
      body: JSON.stringify({
        language_code: locale,
      }),
    },
  ).then((response) => response.json());

export const getTranslationsSource = ({
  projectSlug,
  slug,
}: {
  projectSlug: string;
  slug: string;
}) => {
  return got(
    `${WEBLATE_API_ENDPOINT_ROOT}/translations/${projectSlug}/${slug}/en/units/`,
    {
      method: 'GET',
      headers: {
        ...DEFAULT_WEBLATE_HEADERS,
      },
    },
  )
    .json()
    .then((data: any) => data.results);
};

export const getTranslationsUnit = ({ id }: { id: number }) => {
  return got(`${WEBLATE_API_ENDPOINT_ROOT}/units/${id}/`, {
    method: 'GET',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
  }).json();
};

export const getComponentsTranslations = ({
  projectSlug,
  slug,
  locale,
}: {
  projectSlug: string;
  slug: string;
  locale?: string;
}) =>
  got(
    `${WEBLATE_API_ENDPOINT_ROOT}/translations/${projectSlug}/${slug}/${locale}/units/`,
    {
      headers: {
        ...DEFAULT_WEBLATE_HEADERS,
      },
    },
  ).json();

export const downloadLanguageFile = ({
  projectSlug,
  slug,
  locale,
  filePath = '',
}) =>
  fetch(
    `${WEBLATE_API_ENDPOINT_ROOT}/translations/${projectSlug}/${slug}/${locale}/file`,
    {
      method: 'GET',
      headers: {
        ...DEFAULT_WEBLATE_HEADERS,
      },
    },
  )
    .then((res) => res.arrayBuffer())
    .then((data) => {
      if (!filePath) return Buffer.from(data).toString();
      ensureDirExists(filePath);
      fs.writeFileSync(filePath, Buffer.from(data));
      return {
        data,
        filePath,
      };
    });

// For File-based i.e. no VCS (git)
export const createTranslationComponent = ({
  projectSlug,
  name,
  slug,
  fileFormat,
  newBase,
  filemask,
}) => {
  const body = {
    branch: 'master',
    // even override json not working
    // 'file_format': 'json',
    file_format: fileFormat,
    filemask,
    git_export: '',
    license: '',
    license_url: '',
    // important to exclude nested folder
    language_regex: '^[a-zA-Z0-9-_]+$',
    name,
    slug,
    template: newBase,
    new_base: newBase,
    manage_units: true,
  };

  console.log('body', body, 'projectSlug', projectSlug);

  return fetch(
    `${WEBLATE_API_ENDPOINT_ROOT}/projects/${projectSlug}/components/`,
    {
      method: 'POST',
      headers: {
        ...DEFAULT_WEBLATE_HEADERS,
      },
      body: JSON.stringify(body),
    },
  ).then((res) => res.json());
};

// Add instead of replace strings
// https://docs.weblate.org/en/latest/devel/integration.html#adding-new-strings
// https://docs.weblate.org/en/latest/admin/projects.html#component-manage-units
//  we use source, target instead of key, value in misleading docs
// The target and source are  arrays to properly handle plural strings.

// https://github.com/WeblateOrg/weblate/commit/f2dc6946ca5022f6152379a3d12f14563110c886
export const addTranslationUnit = ({
  projectSlug,
  slug,
  locale,
  key,
  source,
  target,
}: {
  projectSlug: string;
  slug: string;
  locale: string;
  key: string;
  source: string[];
  target: string[];
}) => {
  console.log(
    'add translation unit',
    'projectSlug',
    projectSlug,
    'slug',
    slug,
    'locale',
    locale,
    'key',
    key,
    source,
    target,
  );
  if (_.isEmpty(source) || _.isEmpty(target)) {
    throw new Error('Missing translation unit key value');
  }
  // TBC length
  if (!key || typeof key !== 'string' || key.length <= 5) {
    throw new Error('Invalid key');
  }
  const endpoint = createWeblateApiEndpoint(
    `/translations/${projectSlug}/${slug}/${locale}/units/`,
  );
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
    body: JSON.stringify({
      context: key,
      source,
      target,
      state: 20,
    }),
  }).then((res) => res.json());
};

export const patchTranslationUnit = ({
  projectSlug,
  slug,
  locale,
  target,
  id,
}: {
  projectSlug: string;
  slug: string;
  locale: string;
  target: string[];
  id: string;
}) => {
  console.log(
    'patch translation unit',
    'projectSlug',
    projectSlug,
    'slug',
    slug,
    'locale',
    locale,
    id,
    target,
  );

  const endpoint = createWeblateApiEndpoint(`/units/${id}/`);
  return got(endpoint, {
    method: 'PATCH',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
    body: JSON.stringify({
      target,
      state: 20,
    }),
  }).json();
};
// 3. API: https://docs.weblate.org/en/latest/api.html#get--api-translations-(string-project)-(string-component)-(string-language)-statistics-

export const getTranslationComponentStatistics = ({ projectSlug, slug }) => {
  const endpoint = createWeblateApiEndpoint(
    `/translations/${projectSlug}/${slug}/en/statistics/`,
  );

  return fetch(endpoint, {
    method: 'GET',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
  }).then((response) => response.json());
};

// Un-tested
// API https://docs.weblate.org/en/latest/api.html#post--api-projects-(string-project)-repository-
export const maintainVCS = ({ projectSlug, operation }) => {
  const url = `${WEBLATE_API_ENDPOINT_ROOT}/projects/${projectSlug}/repository/`;

  const data = {
    operation,
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      ...DEFAULT_WEBLATE_HEADERS,
    },
    // @ts-ignore
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((res) => res);
};

export const ensureDirExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
};
