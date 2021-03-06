/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep } from 'vscode-azureextensionui';
import { ext } from '../../../extensionVariables';
import { localize } from '../../../localize';
import { IFunctionSetting } from '../../../templates/IFunctionSetting';
import { nonNullProp } from '../../../utils/nonNull';
import { IFunctionWizardContext } from '../IFunctionWizardContext';

export class LocalAppSettingNameStep extends AzureWizardPromptStep<IFunctionWizardContext> {
    private readonly _setting: IFunctionSetting;

    public constructor(setting: IFunctionSetting) {
        super();
        this._setting = setting;
    }

    public async prompt(wizardContext: IFunctionWizardContext): Promise<void> {
        const appSettingSuffix: string = `_${nonNullProp(this._setting, 'resourceType').toUpperCase()}`;
        wizardContext[this._setting.name] = await ext.ui.showInputBox({
            placeHolder: localize('appSettingKeyPlaceholder', 'Local app setting key'),
            prompt: localize('appSettingKeyPrompt', 'Provide a key for a connection string'),
            value: `example${appSettingSuffix}`
        });
    }

    public shouldPrompt(wizardContext: IFunctionWizardContext): boolean {
        return !wizardContext[this._setting.name];
    }
}
