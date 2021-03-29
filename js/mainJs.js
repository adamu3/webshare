
$(document).ready(function(){
	var cameraQState = false
	$('.mainTransferBtn').html('<div class="qrcodeOut"></div>');
	
	$('.mainTransferBtn').hover(function(){
	/*	$('.qrcodeOut').addClass('moveOut');*/
		getData();		
	});	
	let key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];	

	function getData(state) {
	var Qurl = [window.location.href];
	var inputs =[];
	var selects = [];
	var textareas = [];
	var malikan;

		$('input').each(function(){
		   inputs.push($(this).val());
		});
		
		$('select').each(function(){
		   selects.push($(this).find('option:selected').val());
		});
		$('textarea').each(function(){
		   textareas.push($(this).val());
		});

		malikan = {input:inputs, select:selects, textarea:textareas , url:Qurl};				

		malikan = JSON.stringify(malikan);
		//console.log(JSON.parse(malikan));
		let textBytes = aesjs.utils.utf8.toBytes(malikan);
		
		// The counter is optional, and if omitted will begin at 1
		let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
		let encryptedBytes = aesCtr.encrypt(textBytes);
		let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);	
		let size = 150;
			$('.qrcodeOut').removeClass('moveUpk');			
		if(encryptedHex.length > 300 && encryptedHex.length <900){
			size = 200;
		}else if(encryptedHex.length > 899){
			size = 400;
			$('.qrcodeOut').addClass('moveUpk');
		}
		$(".qrcodeOut").html("");
			$(".qrcodeOut").qrcode({
				render: 'canvas',
				minVersion: 1,
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
	        	var encryptedBytes = aesjs.utils.hex.toBytes(result.code);
	        	// The counter mode of operation maintains internal state, so to
				// decrypt a new instance must be instantiated.
				var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
				var decryptedBytes = aesCtr.decrypt(encryptedBytes);
				 
				// Convert our bytes back into text
				var decryptedText = JSON.parse( aesjs.utils.utf8.fromBytes(decryptedBytes) );
	        	/*$('#scannedResultQ').addClass('resultShowQ');
	        	//$('#scannedResultQ').html(result.code);
	        	$('#scannedResultQ').html(decryptedText);*/
	        	
	        	$('input').each(function(index){	        			        			
				   $(this).val(decryptedText['input'][index]);
				});
				
				$('select').each(function(index){
				   //$(this).attr(decryptedText['select'][index]);
				   $(this).find('option:contains('+decryptedText['select'][index]+')').attr('selected','selected');
				});
				$('textarea').each(function(index){
					$(this).val(decryptedText['textarea'][index]);
				});
	   
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
	    
	    decoder = new WebCodeCamJS("#transferPageQ").buildSelectMenu(document.createElement('select'), 'environment|back').init(arg).play();
	    	
	    	$('#transferPageQ').css('height','270px');
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