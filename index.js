//////////
// MAIN //
//////////

	// init canvas
	var canvas = document.getElementById("FilterCanvas");
	var context = canvas.getContext("2d");
	canvas.style.display = 'none';

(function(view) {
		var document = view.document;
		var session = view.sessionStorage;
    var img;

		get_blob = function () {
			return view.Blob;
		}

	//////////////////
	// UPLOAD IMAGE //
	//////////////////

		var upload = document.getElementsByTagName('input')[0];
		var holder = document.getElementById('holder');
		var state = document.getElementById('status');
		var uploadImageName;

		if (typeof window.FileReader === 'undefined') {
			console.log("FAIL")
			state.className = 'fail';
		} else {
			state.className = 'success';
			state.innerHTML = 'Filter Your Photo:';
		}

		upload.onchange = function (e) {
			e.preventDefault();
			drawToCanvas();
		};

	////////////////////
	// DRAW TO CANVAS //
	////////////////////

		function drawToCanvas() {
			console.log("-- DRAW-TO-CANVAS --")
			var file = upload.files[0];
			var uploadedImage;
			var unavsaImage;
			var reader = new FileReader();

      context.clearRect(0, 0, canvas.width, canvas.height);

			// Function to Load Uploaded Image to Canvas
			reader.onloadend = function () {
				console.log("-- READER ON LOAD END --")
				console.log(reader.result)

				uploadedImage = new Image();
				uploadedImage.src = reader.result;


				uploadedImage.onload = function (event) {

          var w = uploadedImage.naturalWidth;
          var h = uploadedImage.naturalHeight;
          var a = w / h;
          var landscape = true;
          if (a < 1) landscape = false;
          // canvas.height = canvas.width / a;
          var sourceX = landscape ? (w - h) / 2 : 0;
          var sourceY = landscape ? 0 : (h - w) / 2;
          var sourceWidth = landscape ? h : w;
          var sourceHeight = landscape ? h : w;
          var destWidth = canvas.width;
          var destHeight = canvas.height;
          var destX = 0;
          var destY = 0;

					context.globalAlpha = 0.3
					// context.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
				  context.drawImage(uploadedImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        }

				unavsaImage = new Image();
				unavsaImage.setAttribute('crossOrigin', 'anonymous');
				unavsaImage.src = './unavsa-logo.png' ;
				unavsaImage.onload = function() {
					context.globalAlpha = 1
					context.globalCompositeOperation = "soft-light";

					context.drawImage(unavsaImage, 0, 0, canvas.width, canvas.height);
					downloadImageFromCanvas()
				}
				canvas.style.display = 'block';
			}

			reader.readAsDataURL(file);
		}


	////////////////////
	// DOWNLOAD IMAGE //
	////////////////////

		function downloadImageFromCanvas () {
			console.log("-- DOWNLOAD-IMAGE --")
			console.log(canvas)

			var canvas_filename = {
				value: "unavsa_image"
			}

			canvas.toBlob(function(blob) {
				console.log("-- canvas.toBlob --")
				console.log(blob)

        if (window.mobileAndTabletcheck) {
        // if (true) {
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL( blob );
          $("#myImg").attr('src', imageUrl);
          $('.mobileModal').show()
          $('#downloadButton').one('click', function(){
            saveAs(blob, (canvas_filename.value || canvas_filename.placeholder) + ".png");
          })
        }
        else {
				  saveAs(blob, (canvas_filename.value || canvas_filename.placeholder) + ".png");
        }

      }, "image/png");
		};
}(self));
