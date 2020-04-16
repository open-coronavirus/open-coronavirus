import { bind, /* inject, */ BindingScope } from '@loopback/core';
import { MinVersionRepository } from '../repositories';
import { MinVersion } from '../models';
import { repository } from '@loopback/repository';

@bind({ scope: BindingScope.TRANSIENT })
export class MinVersionService {
  constructor(
    @repository(MinVersionRepository) public minVersionRepository: MinVersionRepository
  ) { }

  public checkNeededUpdate(frontVersion: string): Promise<boolean> {
    return new Promise(resolve => {
      this.getMinVersion().then((minVersion) => {
        resolve(this.versionCompare(frontVersion, minVersion.minVersion) < 0);
      });
    });
  }

  public getMinVersion(): Promise<MinVersion> {
    return this.minVersionRepository.findOne().then(minVersion => {
      if (minVersion !== null) {
        return minVersion;
      } else {
        let newMinVersion: MinVersion = new MinVersion();
        newMinVersion.minVersion = '1.0.0';

        this.minVersionRepository.create(newMinVersion);

        return newMinVersion;
      }
    });
  }

  public versionCompare(frontVersion: string, minVersion: string) {
    let i, diff;
    const regExStrip0 = /(\.0+)+$/;
    const segmentsFrontVersion = frontVersion.replace(regExStrip0, '').split('.');
    const segmentsMinVersion = minVersion.replace(regExStrip0, '').split('.');
    const l = Math.min(segmentsFrontVersion.length, segmentsMinVersion.length);

    for (i = 0; i < l; i++) {
      diff = parseInt(segmentsFrontVersion[i], 10) - parseInt(segmentsMinVersion[i], 10);
      if (diff) {
        return diff;
      }
    }

    return segmentsFrontVersion.length - segmentsMinVersion.length;
  }
}
