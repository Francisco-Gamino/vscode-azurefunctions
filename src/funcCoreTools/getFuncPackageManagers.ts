/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { funcPackageName, PackageManager, Platform } from '../constants';
import { cpUtils } from '../utils/cpUtils';

export async function getFuncPackageManagers(isFuncInstalled: boolean): Promise<PackageManager[]> {
    const result: PackageManager[] = [];
    switch (process.platform) {
        case Platform.Linux:
            // https://github.com/Microsoft/vscode-azurefunctions/issues/311
            break;
        case Platform.MacOS:
            try {
                isFuncInstalled ?
                    await cpUtils.executeCommand(undefined, undefined, 'brew', 'ls', funcPackageName) :
                    await cpUtils.executeCommand(undefined, undefined, 'brew', '--version');
                result.push(PackageManager.brew);
            } catch (error) {
                // an error indicates no brew
            }
        // fall through to check npm on both mac and windows
        default:
            try {
                isFuncInstalled ?
                    await cpUtils.executeCommand(undefined, undefined, 'npm', 'ls', '-g', funcPackageName) :
                    await cpUtils.executeCommand(undefined, undefined, 'npm', '--version');
                result.push(PackageManager.npm);
            } catch (error) {
                // an error indicates no npm
            }
    }
    return result;
}
