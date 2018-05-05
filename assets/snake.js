	(function () {
		var scoreBoard = jQuery('#scoreBoard');
		var snakeBody = jQuery('<div class="snakeBody">');
		var positionList = JSON.parse(localStorage.getItem('positionList') || "[]");
		var direction = JSON.parse(localStorage.getItem('direction')) || {
			horizontal: 1,
			vertical: 0
		};
		var windowHeight = jQuery(window).height();
		var windowWidth = jQuery(window).width();
		var score = 0;
		var randomX, randomY;

		function generateRandomLocation() {
			randomX = Math.floor(Math.random() * windowWidth);
			randomY = Math.floor(Math.random() * windowHeight);
			//15' in katı yapmak
			var a = randomX % 15;
			randomX -= a;
			a = randomY % 15;
			randomY -= a;
		}

		function generateFood() {
			positions = generateRandomLocation();
			var food = jQuery('<span></span>').css({
				'position': 'absolute',
				'background-color': 'yellow',
				'width': '15px',
				'height': '15px',
				'top': randomY + 'px',
				'left': randomX + 'px',
				'z-index': 99
			}).attr('id', 'food');
			jQuery('body').append(food);
		}

		var getNextPosition = function (elem) {
			var position = {};

			if (jQuery('#food').length == 0) {
				generateFood();
			}
			direction.horizontal && (position.left = Number(jQuery(elem).css('left').replace('px', '')) + (direction.horizontal * 15));
			direction.vertical && (position.top = Number(jQuery(elem).css('top').replace('px', '')) + (direction.vertical * 15));

			position.top && ((position.top > jQuery(window).height() && (position.top = 0)) || (position.top < 0 && (position.top = jQuery(window).height())));
			position.left && ((position.left > jQuery(window).width() && (position.left = 0)) || (position.left < 0 && (position.left = jQuery(window).width())));

			var snakeTop = jQuery('.snakeBody:first').css('top').replace('px', '');
			var snakeLeft = jQuery('.snakeBody:first').css('left').replace('px', '');

			if (jQuery('#selfCollision').is(':checked') == true) {
				positionList.forEach(function (e, index) {
					if (index == 0) return;

					if (snakeLeft == e.left && snakeTop == e.top) {
						console.error('self collision');
					}
				});
			}
			if (jQuery('#wallCollision').is(':checked') == true) {
				if ((snakeLeft == 0) || ((windowHeight - 15) == snakeTop) || (snakeTop == 0) || (snakeLeft == windowWidth)) {
					console.error('wall collision');
				}
			}
			if (snakeLeft == randomX && snakeTop == randomY) {
				jQuery('#food').remove();
				generateFood();
				jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
				scoreBoard.text('');

				score += 2;
				scoreBoard.append(score);
			}
			return position;
		};

		var elemaniGetir = function () {
			var targetArea = {
				top: Number(jQuery('.snakeBody:first').css('top').replace('px', '')) + (direction.vertical && direction.vertical * 15),
				left: Number(jQuery('.snakeBody:first').css('left').replace('px', '')) + (direction.horizontal && direction.horizontal * 15)
			};
			return jQuery(document.elementFromPoint(targetArea.left, targetArea.top));
		};

		var saveGameData = function () {
			localStorage.setItem('positionList', JSON.stringify(positionList));
			localStorage.setItem('direction', JSON.stringify(direction));
		};

		jQuery(document).keydown(function (e) {
			if (jQuery.inArray(e.keyCode, [32, 37, 38, 39, 40]) == -1) return;

			var moveY,
				moveX;

			if (direction.horizontal && (e.keyCode == 37 || e.keyCode == 39)) {
				moveX = direction.horizontal;
			} else {
				moveX = (e.keyCode == 37 && -1) || (e.keyCode == 39 && 1) || 0;
			}
			if (direction.vertical && (e.keyCode == 38 || e.keyCode == 40)) {
				moveY = direction.vertical;
			} else {
				moveY = (e.keyCode == 38 && -1) || (e.keyCode == 40 && 1) || 0;
			}

			if (e.keyCode == 32) {
				saveGameData();
				elemaniGetir().length > 0 && (elemaniGetir()[0].click());
				e.preventDefault();
				return;
			}

			direction = {
				horizontal: moveX,
				vertical: moveY
			};
			e.preventDefault();

		});

		setInterval(function () {
			score += 1;
			scoreBoard.text("");
			scoreBoard.append(score);
		}, 10000 / 2);

		setInterval(function () {
			jQuery('.snakeBody').each(function (key) {
				positionList[key] = {
					top: Number(jQuery(this).css('top').replace('px', '')),
					left: Number(jQuery(this).css('left').replace('px', ''))
				};
				if (key == 0)
					jQuery(this).css(getNextPosition(jQuery(this)));
				else
					jQuery(this).css(positionList[key - 1]);

			});

		}, 300);



		jQuery('body').append('<style>.snakeBody { z-index:99999999; width: 15px; height: 15px; position: fixed; top: 0; left:0; background: black;} .snakeBody:first-child {background: red;}</style>');

		var i = 0;

		while (i < 20) {
			jQuery('body').append(snakeBody.clone().css(positionList[i] || {}));
			i++;
		}
		jQuery('.snakeBody:first').css('background', 'red');

	})();