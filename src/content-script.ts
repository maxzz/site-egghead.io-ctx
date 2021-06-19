function main() {
    let container = document.createElement('div');
    container.style.position = 'absolut';
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
                <input id="tm-code" spellcheck="false">
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

        function getPlayerItemsUrl(html: string): string {
            const reAxiosItemsQuery = /\/course\/\d{3,10}?\/lessons/g;
            let m: RegExpExecArray | null = reAxiosItemsQuery.exec(html);
            return m ? `https://coursehunter.net${m[0]}` : '';
        }

        let itemsUrl = getPlayerItemsUrl(html); //https://coursehunter.net/course/208/lessons"
        if (!itemsUrl) {
            throw new Error("Cannot find play items link");
        }
        
        let res = await fetch(itemsUrl);
        let items = res.ok && await res.text();
        if (!res.ok) {
            throw new Error("Cannot fetch play items");
        }

        return JSON.stringify({
            a: 'tm',
            docurl: document.location.href,
            itemsurl: itemsUrl,
            doc: html,
            items: items,
        });
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
