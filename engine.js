const fs = require('fs');
const puppeteer = require('puppeteer');


console.log_passer = function(d, logfile, option) {
	if (option == 0) {
		process.stdout.write(d + '\n');
	} else if (option == 1) {
		fs.appendFile(logfile, d + '\n', (err) => { if(err) { throw err; } });
	} else {
		process.stdout.write(d + '\n');
		fs.appendFile(logfile, d + '\n', (err) => { if(err) { throw err; } });
	}

}


async function passer(headless_bool, proxy_arr, url_arr, wait_time, n_limit, logfile, variance) {
	

	function wait(time) {
		return new Promise(resolve => {
			setTimeout(resolve, time);
		});
	}


	async function going(prox, url_arr, wait_time) {
		// console.log_passer(prox, logfile);
		let random = Math.random()*variance;
		let browser = await puppeteer.launch({
			headless : headless_bool,
			args: [
			'--proxy-server=' + prox,
			]
		});

		let page = await browser.newPage();

		try {


			for (j = 0; j < url_arr.length; j++) {
				// console.log(j + ' j')
				console.log_passer('-->' + prox + ' is going to page: ' + url_arr[j], logfile);
				await page.goto(url_arr[j], { waitUntil : 'domcontentloaded', timeout : 20000 });
				await page.waitFor(parseInt(wait_time) + random);
			}
			console.log_passer('<--' + prox + ' done', logfile);
			browser.close();
			return;
		} catch(e) {
			console.log_passer('<--' + prox + ' ' + e, logfile);
			browser.close();
		}
		
	}


	try {
		if (proxy_arr == [''] || url_arr == [''] || wait_time == '' || n_limit == '') { throw('null data'); }

		let instance = 0;
		for (i = 0; i < proxy_arr.length; i++) {
			// console.log(i + ' i');
			
			if (instance < n_limit) {
				if (i == proxy_arr.length-1) {
					await going(proxy_arr[i], url_arr, wait_time).then(() => { instance--; }).catch(() => { instance--; });
				} else {
					going(proxy_arr[i], url_arr, wait_time).then(() => { instance--; }).catch(() => { instance-- });
					instance++;
					console.log(instance + ' instance');
					
				}
				
			} else {
				while (instance >= n_limit ) {
					// console.log('wait');
					await wait(200);
				}
				i--;
			}

		}

		// console.log('engine reach end');
		
		return 0;
	} catch(e) {
		throw new Error(e);
	}

}

// let proxy = ['61.7.177.99:3128', '185.93.3.123:8080', '34.201.2.115:3128', '133.130.103.208:8080', '77.73.67.74:3128', '185.93.3.123:8080'];
// let url = ['http://hoichowebsite.com', 'http://hoichowebsite.com/category/thi-truong-va-kinh-te/', 'http://hoichowebsite.com/bi-quyet-lam-giau-lien-ket-trong-lan-vu-nu-xuat-khau-kinh-doan/'];
// let delay = 5000;
// let logfile = __dirname + '/abc';

// passer(proxy, url, delay, 3, logfile);

// passer(true, [''], [''], '', '', __dirname + '/logs/' + 'iwIGoF6kQD6XzjMLAAAA');
module.exports = passer;

// 61.7.177.99:3128;185.93.3.123:8080;34.201.2.115:3128
// http://hoichowebsite.com;http://hoichowebsite.com/category/thi-truong-va-kinh-te/