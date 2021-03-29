import {$, JQuery} from './jquery.js'
$(document).ready(function(){
	var cameraQState = false
	$('.mainTransferBtn').html('<div class="qrcodeOut"></div>');
	
	$('.mainTransferBtn').hover(function(){
		$('.qrcodeOut').css('let','60px');
		getData();		
	});	

	function getData(state) {
	var Qurl = window.location.href;
	var inputs =[];
	var selects = [];
	var malikan;

		$('input').each(function(){
		   inputs.push($(this).val());
		});
		
		$('select').each(function(){
		   selects.push($(this).find('option:selected').val());
		});
		malikan = {input:inputs, select:selects, url:Qurl };				

		let key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];	
		malikan = JSON.stringify(malikan);
		let textBytes = aesjs.utils.utf8.toBytes(malikan);
		
		// The counter is optional, and if omitted will begin at 1
		let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
		let encryptedBytes = aesCtr.encrypt(textBytes);
		let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);	
		let size = 150;
		if(encryptedHex.length > 300 && encryptedHex.length <400){
			size = 200;
		}
		$(".qrcodeOut").html("");
			$(".qrcodeOut").qrcode({
				render: 'canvas',
				minVersion: 0.,
				size: size,
				fill: '#000',
				text: encryptedHex,
				background: '#fff'
			});
	}




	$('.mainTransferBtn').on('click', function(){		
	    if (cameraQState===false) {
			$('<div class="cameraQ"><canvas id="transferPageQ"></canvas><div id="scannedResultQ"></div></div>').insertAfter('.mainTransferBtn');
    		cameraQState = true;
	    }else if(cameraQState === true){
	    	$('.cameraQ').show(200);    		
	    }
	    
		var txt = "innerText" in HTMLElement.prototype ? "innerText" : "textContent";
	    var arg = {
	        resultFunction: function(result) {
	        	$('#scannedResultQ').addClass('resultShowQ');
	        	$('#scannedResultQ').html('<a href="'+result.code+'">'+result.code+'</a>');
	        	/*var aChild = document.createElement('a');
	        	aChild[txt] = result.format + ': ' + result.code;
	            document.querySelector('body').appendChild(aChild);*/
	        },
	         getDevicesError: function(error) {
            var p, message = "Error detected with the following parameters:\n";
            for (p in error) {
                message += p + ": " + error[p] + "\n";
            }
           // alert(message);
	        },
	        getUserMediaError: function(error) {
	            var p, message = "Error detected with the following parameters:\n";
	            for (p in error) {
	                message += p + ": " + error[p] + "\n";
	            }
	            alert(message);
	        },
	        cameraError: function(error) {
	            var p, message = "Error detected with the following parameters:\n";
	            if (error.name == "NotSupportedError") {
	                var ans = confirm("Your browser does not support getUserMedia via HTTP!\n(see: https:goo.gl/Y0ZkNV).\n You want to see github demo page in a new window?");
	                if (ans) {
	                    window.open("https://andrastoth.github.io/webcodecamjs/");
	                }
	            } else {
	                for (p in error) {
	                    message += p + ": " + error[p] + "\n";
	                }
	                alert(message);
	            }
	        },
	        cameraSuccess: function() {
	            grabImg.classList.remove("disabled");
	        }
	    };
	    
	    decoder = new WebCodeCamJS("#transferPageQ").init(arg).play();

		$('.cameraQ').on('click', function(){			
			 if (decoder.isInitialized()) {
            	decoder.stop();
        	}
			$(this).hide(100);
		}).find($('#transferPageQ')).click(function(event){
			//prevent clear on click menu
			event.stopPropagation();	
		})

	})


})