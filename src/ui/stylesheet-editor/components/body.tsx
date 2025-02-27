import {m} from 'malevic';
import {Button} from '../../controls';
import {getURLHost, isURLInList} from '../../../utils/url';
import {ExtWrapper, TabInfo} from '../../../definitions';

interface BodyProps extends ExtWrapper {
    tab: TabInfo;
}

export default function Body({data, tab, actions}: BodyProps) {

    const host = getURLHost(tab.url);
    const custom = data.settings.customThemes.find(({url}) => isURLInList(tab.url, url));

    let textNode: HTMLTextAreaElement;

    const placeholderText = [
        '* {',
        '    background-color: #234 !important;',
        '    color: #cba !important;',
        '}',
    ].join('\n');

    function onTextRender(node) {
        textNode = node;
        textNode.value = (custom ? custom.theme.stylesheet : data.settings.theme.stylesheet) || '';
        if (document.activeElement !== textNode) {
            textNode.focus();
        }
    }

    function applyStyleSheet(css: string) {
        if (custom) {
            custom.theme = {...custom.theme, ...{stylesheet: css}};
            actions.changeSettings({customThemes: data.settings.customThemes});
        } else {
            actions.setTheme({stylesheet: css});
        }
    }

    function reset() {
        applyStyleSheet('');
    }

    function apply() {
        const css = textNode.value;
        applyStyleSheet(css);
    }

    return (
        <body>
            <header>
                <h1 id="title">CSS Editor</h1>
            </header>
            <h3 id="sub-title">{custom ? host : 'All websites'}</h3>
            <textarea
                id="editor"
                native
                placeholder={placeholderText}
                didmount={onTextRender}
                didupdate={onTextRender}
            />
            <div id="buttons">
                <Button onclick={reset}>Reset</Button>
                <Button onclick={apply}>Apply</Button>
            </div>
        </body>
    );
}
