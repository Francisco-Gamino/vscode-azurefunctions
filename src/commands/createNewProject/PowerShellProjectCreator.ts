/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from 'fs-extra';
import * as path from 'path';
import { profileps1FileName, TemplateFilter } from "../../constants";
import { powershellDebugConfig } from "../../debug/PowerShellDebugProvider";
import { confirmOverwriteFile } from "../../utils/fs";
import { ScriptProjectCreatorBase } from './ScriptProjectCreatorBase';

const profileps1: string = `# Azure Functions profile.ps1
#
# This profile.ps1 will get executed every "cold start" of your Function App.
# "cold start" occurs when:
#
# * A Function App starts up for the very first time
# * A Function App starts up after being de-allocated due to inactivity
#
# You can define helper functions, run commands, or specify environment variables
# NOTE: any variables defined that are not environment variables will get reset after the first execution

# Authenticate with Azure PowerShell using MSI.
# Remove this if you are not planning on using MSI or Azure PowerShell.
if ($env:MSI_SECRET -and (Get-Module -ListAvailable Az.Accounts)) {
    Connect-AzAccount -Identity
}

# Uncomment the next line to enable legacy AzureRm alias in Azure PowerShell.
# Enable-AzureRmAlias

# You can also define functions or aliases that can be referenced in any of your PowerShell functions.
`;

export class PowerShellProjectCreator extends ScriptProjectCreatorBase {
    public readonly templateFilter: TemplateFilter = TemplateFilter.Verified;
    public readonly functionsWorkerRuntime: string | undefined = 'powershell';

    public getLaunchJson(): {} {
        return {
            version: '0.2.0',
            configurations: [powershellDebugConfig]
        };
    }

    public async onCreateNewProject(): Promise<void> {
        await super.onCreateNewProject();

        const profileps1Path: string = path.join(this.functionAppPath, profileps1FileName);
        if (await confirmOverwriteFile(profileps1Path)) {
            await fse.writeFile(profileps1Path, profileps1);
        }
    }

    public getRecommendedExtensions(): string[] {
        return super.getRecommendedExtensions().concat(['ms-vscode.PowerShell']);
    }
}
