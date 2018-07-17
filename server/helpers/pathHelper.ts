import * as path from 'path';

enum Profiles {
    DEV = 'development',
    PROD = 'production',
}

interface IProfileData {
    root: string;
    data: string;
    local: string;
    client: string;
}

const profileData = {
  [Profiles.PROD]: {
    root: '../',
    data: './data',
    local: './local',
    client: './client',
  },
  [Profiles.DEV]: {
    root: '../../..',
    data: './data',
    local: './local',
    client: './build/client',
  },
};

const rootPath = getRootPath();

export default {
  path,
  getRelative: getRelativePath,
  getDataRelative: getDataRelativePath,
  getLocalRelative: getLocalRelativePath,
  getClientRelative: getClientRelativePath,
};

function getDataRelativePath(...paths: string[]) {
  return getRelativePath('data', ...paths);
}

function getLocalRelativePath(...paths: string[]) {
  return getRelativePath('local', ...paths);
}

function getClientRelativePath(...paths: string[]) {
  return getRelativePath('client', ...paths);
}

function getRelativePath(profileFolder: keyof IProfileData, ...paths: string[]) {
  const folderRelative = profileData[getCurrentProfile()][profileFolder];

  if (!folderRelative) { throw Error(`Cannot find relative folder profile '${profileFolder}'`); }

  paths.unshift(folderRelative);
  paths.unshift(rootPath);

  return path.join.apply(this, paths);
}

function getRootPath() {
  // TODO work around for ts-node
  if (path.extname(__filename) === '.ts') {
    profileData.development.root = '../..';
  }

  const rootRelative = profileData[getCurrentProfile()].root;

  if (!rootRelative) { throw Error('Cannot find root folder'); }

  return path.join(__dirname, rootRelative);
}

function getCurrentProfile(): Profiles {
  const env = <Profiles>process.env['NODE_ENV'];

  return env ? env : Profiles.DEV;
}
