function main() {
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.zIndex = '1000';

    container.innerHTML = `
        <style>
            #tm-root > * {
                margin: 0;
                font-family: Avenir, Helvetica, Arial, sans-serif;
                font-size: .6rem;
            }
            #tm-root button {
                border: 1px solid #272727;

                background-color: #e6e8ff;
                border-radius: 2px;
                padding: 0 .4rem;
            }
            #tm-btns {
                display: none;
                margin-left: .2rem;
            }
            #tm-code {
                /*max-width: 1px; opacity: 0;*/
                display: none;
                font-size: .5rem;
                margin-left: .2rem;

                padding: 0 .1rem;
                line-height: 1rem;
                background-color: #f2fff9;
            }
            #tm-info {
                position: absolute;
                top: 1.4rem;
                left: 1.2rem;
                font-size: .9rem;
                padding: .2rem .4rem;
                display: none;
                border-radius: 3px;
            }
            #tm-info.copied {
                background-color: green;
                color: white;
                display: block;
            }
            #tm-info.failed {
                background-color: red;
                color: white;
                display: block;
                min-width: 10rem;
            }
        </style>

        <div id="tm-root">
            <div style="display: flex">
                <button id="tm-run">o</button>
                <div id="tm-btns">
                    <button>copy</button>
                    <button style="margin-left: -1px">x</button>
                </div>
                <textarea id="tm-code" rows="1" cols="100" spellcheck="false"></textarea>
                <!-- <input id="tm-code-2" spellcheck="false"> -->
            </div>
            <div id="tm-info"></div>
        </div>
    `;

    let btn = container.querySelector('#tm-run');
    let btns = container.querySelector('#tm-btns') as HTMLElement;
    let allbtns = btns?.querySelectorAll('button');
    let btncopy = allbtns?.[0];
    let btnclose = allbtns?.[1];
    let code = container.querySelector('#tm-code') as HTMLInputElement;
    let info = container.querySelector('#tm-info') as HTMLElement;

    function showResult(ok: boolean) {
        let className = ok ? 'copied' : 'failed';
        let delay = ok ? 500 : 1500;
        info.innerText = ok ? 'copied' : 'failed. check console.';
        info.classList.add(className);
        setTimeout(() => info.classList.remove(className), delay);
    }

    function copyToClipboard() {
        const el = code;
        el.select();
        el.setSelectionRange(0, 9999999);
        document.execCommand('copy');
        showResult(true);
    }

    async function collectData() {
        let html = document.documentElement.outerHTML;

        let firstLink = document.querySelector('link[rel=canonical]');
        if (!firstLink) {
            throw new Error("Cannot the first link");
        }

        let links = ([firstLink, ...document.querySelectorAll('.simplebar-content > ol > li a')] as HTMLAnchorElement[]).map(a => a.href);
        if (!links.length) {
            throw new Error("Cannot find play item links");
        }

        let final = links.reduce((acc: string, val: string) => {
            return `${acc}\n${val}`;
        }, '').trim();

        console.log('items', final);
        
        return final;
    }

    btn?.addEventListener('click', async (e) => {
        try {
            btns.style.display = 'none';
            code.style.display = 'none';
            code.value = '';

            let data = await collectData();
            code.style.display = 'block';
            code.value = data;
            btns.style.display = 'flex';
            console.log('tm done'); // leave here for debugging.
        } catch (error) {
            btns.style.display = 'none';
            showResult(false);
            console.log('tm error', error);
        }
    }, false);

    btncopy?.addEventListener('click', () => {
        copyToClipboard();
    }, false);

    btnclose?.addEventListener('click', () => {
        btns.style.display = 'none';
        code.style.display = 'none';
        code.value = '';
    }, false);

    document.body.insertBefore(container, document.body.firstElementChild);
}

main();
