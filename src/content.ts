const numFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseNumber(num: string): number {
  if (num.toLowerCase() === 'free') {
    return 0;
  }

  const filteredNum = num.replace(/[\$,]/g, '')
  const multiplierMapper: { [key: string]: number } = {'k': 1000, 'm': 1000000, 'b': 1000000000};

  const lastChar = filteredNum.charAt(num.length - 1).toLowerCase();
  let multiplier = 1;

  if (lastChar in multiplierMapper) {
    multiplier = multiplierMapper[lastChar];
  }

  
  const parsed = parseFloat(filteredNum);
  return parsed * multiplier;
}

function generateHTML(currentRake: number, maxRake: number): string {
  let currentRakeClass = '';
  let rakeClass = '';

  if (currentRake <= 0) {
    currentRakeClass = 'js-rake-good';
  }

  if (currentRake > 10) {
    rakeClass = 'js-rake-strike';
  }

  return `<span class="${rakeClass}">Current Rake: <span class="${currentRakeClass}">${isFinite(currentRake) ? numFormatter.format(currentRake) : 0}%</span> Max Rake: ${isFinite(maxRake) ? numFormatter.format(maxRake) : 0}%</span>`;
}

function process() {
  const names = document.querySelectorAll('.ys-contests-list .infinite-scroll-list tr [data-tst="contest-row-contest-name"]') as NodeListOf<HTMLElement> | null;
  const entrySizes = document.querySelectorAll('.ys-contests-list .infinite-scroll-list tr [data-tst-entry-size]') as NodeListOf<HTMLElement> | null;
  const fees = document.querySelectorAll('.ys-contests-list .infinite-scroll-list tr [data-tst="entry-fee"]') as NodeListOf<HTMLElement> | null;
  const prizes = document.querySelectorAll('.ys-contests-list .infinite-scroll-list tr [data-tst="prizes"]') as NodeListOf<HTMLElement> | null;

  if (!entrySizes || entrySizes.length !== fees?.length || entrySizes.length !== prizes?.length || entrySizes.length !== names?.length) {
    alert('Invalid number of rows. Page maybe changed while parsing');
    return;
  }

  if (entrySizes.length > 0) {
    entrySizes.forEach((_, i) => {
      const el = document.createElement('div');
      el.className = 'js-rake';
      const entries = entrySizes[i].innerText.split('/');
      const currentEntires = parseNumber(entries[0]);
      const maxEntries = parseNumber(entrySizes[i].getAttribute('data-tst-entry-size') as string);
      const entryFee = parseNumber(fees[i].innerText);
      const prizePool = parseNumber(prizes[i].innerText);
      const currentRake = (((currentEntires*entryFee)-prizePool)/(currentEntires*entryFee))*100;
      const maxRake = (((maxEntries*entryFee)-prizePool)/(maxEntries*entryFee))*100;
      const html = generateHTML(currentRake, maxRake);
      
      const rakeData = names[i].querySelector('.js-rake');

      if (rakeData) {
        rakeData.innerHTML = html;
      } else {
        el.innerHTML = html;
        names[i].append(el);
      }
    })
  }
}

process();
setInterval(process, 3000);
