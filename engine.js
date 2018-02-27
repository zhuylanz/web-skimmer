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


async function passer(headless_bool, proxy_arr, url_arr, wait_time, n_limit, logfile) {
	

	function wait(time) {
		return new Promise(resolve => {
			setTimeout(resolve, time);
		});
	}


	async function going(prox, wait_time){
		console.log_passer(prox, logfile);

		let browser = await puppeteer.launch({
			headless : headless_bool,
			args: [
			'--proxy-server=' + prox,
			]
		});

		let page = await browser.newPage();

		try {


			for (j in url_arr) {
				console.log_passer('--' + prox + ' is going to page: ' + url_arr[j], logfile);
				await page.goto(url_arr[j], { waitUntil : 'domcontentloaded', timeout : 10000 });
				await page.waitFor(parseInt(wait_time));
			}

			browser.close();
		} catch(e) {
			console.log_passer(prox + ' ' + e, logfile);
			browser.close();
		}

		return;
	}


	try {
		if (proxy_arr == [''] || url_arr == [''] || wait_time == '' || n_limit == '') { throw('null data'); }

		let instance = 0;
		for (i = 0; i < proxy_arr.length; i++) {
			
			if (instance < n_limit) {	
				going(proxy_arr[i], wait_time).then(() => { instance--; }).catch(() => { instance--; });
				instance++;
				
			} else {
				while (instance >= n_limit ) {
					await wait(200);
				}
			}

		}

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