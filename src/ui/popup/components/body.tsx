import {m} from 'malevic';
import withForms from 'malevic/forms';
import withState, {useState} from 'malevic/state';
import {TabPanel, Button} from '../../controls';
import FilterSettings from './filter-settings';
import {Header, MoreToggleSettings} from './header';
import Loader from './loader';
import MoreSettings from './more-settings';
import SiteListSettings from './site-list-settings';
import {isFirefox} from '../../../utils/platform';
import {getDuration} from '../../../utils/time';
import {getLocalMessage} from '../../../utils/locales';
import {ExtensionData, ExtensionActions, TabInfo} from '../../../definitions';

withForms();

interface BodyProps {
    data: ExtensionData;
    tab: TabInfo;
    actions: ExtensionActions;
}

interface BodyState {
    activeTab: string;
    moreToggleSettingsOpen: boolean;
}

function openDevTools() {
    chrome.windows.create({
        type: 'panel',
        url: isFirefox() ? '../devtools/index.html' : 'ui/devtools/index.html',
        width: 600,
        height: 600,
    });
}

function Body(props: BodyProps) {
    const {state, setState} = useState<BodyState>({
        activeTab: 'Filter',
        moreToggleSettingsOpen: false,
    });
    if (!props.data.isReady) {
        return (
            <body>
                <Loader complete={false} />
            </body>
        )
    }

    function toggleMoreToggleSettings() {
        setState({moreToggleSettingsOpen: !state.moreToggleSettingsOpen});
    }

    return (
        <body class={{'ext-disabled': !props.data.isEnabled}}>
            <Loader complete />

            <Header
                data={props.data}
                tab={props.tab}
                actions={props.actions}
                onMoreToggleSettingsClick={toggleMoreToggleSettings}
            />

            <TabPanel
                activeTab={state.activeTab}
                onSwitchTab={(tab) => setState({activeTab: tab})}
                tabs={{
                    'Filter': (
                        <FilterSettings data={props.data} actions={props.actions} tab={props.tab} />
                    ),
                    'Site list': (
                        <SiteListSettings data={props.data} actions={props.actions} isFocused={state.activeTab === 'Site list'} />
                    ),
                    'More': (
                        <MoreSettings data={props.data} actions={props.actions} tab={props.tab} />
                    ),
                }}
                tabLabels={{
                    'Filter': getLocalMessage('filter'),
                    'Site list': getLocalMessage('site_list'),
                    'More': getLocalMessage('more'),
                }}
            />

            <footer>
              <div class="footer-links"></div>
                <div class="footer-buttons">

                    <Button onclick={openDevTools} class="dev-tools-button">
                        🛠 {getLocalMessage('open_dev_tools')}
                    </Button>
                </div>
            </footer>
            <MoreToggleSettings
                data={props.data}
                actions={props.actions}
                isExpanded={state.moreToggleSettingsOpen}
                onClose={toggleMoreToggleSettings}
            />
        </body>
    );
}

export default withState(Body);
