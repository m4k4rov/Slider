class SliderBox {

  constructor(box, options){
    this.slideIndex = 0
    this.options = options || {}
    this.intervalId = null
    this.sliderBox = document.querySelector(box)
    this.sliderContainer = this.sliderBox.querySelector('.slider_container');
    this.sliderItems = this.sliderBox.getElementsByClassName('slider_content-item')
    this.controlItems = this.sliderBox.getElementsByClassName('slider_control-item')
    this.dotContainer = this.sliderBox.querySelector('.slider_dots')
    this.swipeSlide()
    this.Go()
  }

  Go(){
    console.log(this.sliderBox);
    const {slideIndex, sliderItems, controlItems, changeSlideIndex, dotContainer, options: {startSlade = 1, fade = false}} = this;
    this.slideIndex = startSlade-1;
    for (let i=0; i<controlItems.length; i++){ //события на влев/вправо
      controlItems[i].addEventListener('click', changeSlideIndex.call(this, i));
    };

    for (let i=0; i<sliderItems.length; i++){ // рендерим точки
      this.renderDot(i);
    };

    if (dotContainer) 
    {
      const dotItems = dotContainer.childNodes; // Массив точек

      for (let i=0; i < dotItems.length; i++){ //удаление у точек класса active
        dotItems[i].classList.remove('active');
      }
      dotItems[startSlade-1].classList.add('active');  //добавление стартовой точке класса active
    };
    
    if (fade) {                                   //анимация fade
      for (let i=0; i<sliderItems.length; i++){   //все слайды прозрачные
      sliderItems[i].style.opacity = '0';         
      }
      sliderItems[startSlade-1].style.opacity = '1';// Стартовый слайд не прозрачный
    } else {                                      //Обычный слайдер
      const contentBlock = this.getSliderContent();

      contentBlock.classList.add('fade-off');
      contentBlock.style.gridTemplateColumns = `repeat(${sliderItems.length}, 100%)`; //Количество колонок грида равно количеству элементов

      for (let i=0; i<sliderItems.length; i++){ 
        sliderItems[i].classList.add('fade-off');
      }
      const step = contentBlock.clientWidth;
      contentBlock.style.left = `-${step * (startSlade-1)}px`;
    }

    if (this.options.autoPlay) this.runAutoPlay(); 
  }

  modalCreate(evt) {                                //Функция модального окна
    const {options: {fade, modal = false}} = this;
    if (!modal || fade) return;

    const sliderModal = document.createElement('div');
    sliderModal.classList.add('slider_modal');

    const modalItem = document.createElement('img');
    modalItem.classList.add('modal-item');
    modalItem.src=evt.src;
    sliderModal.append(modalItem);

    const modalClose = document.createElement('div');
    modalClose.classList.add('modal-close');
    sliderModal.append(modalClose);
    modalClose.addEventListener('click', () => sliderModal.remove());

    if (evt.title) {
      const title = document.createElement('h2');
      title.textContent = evt.title;
      sliderModal.append(title);
    }

    document.body.append(sliderModal);

  }

  getSliderContent() {
    return this.sliderBox.querySelector('.slider_content');
  }

  runAutoPlay(){                                        //Функция автовоспроизведения через delay
    const {changeSlideIndex, options: {delay}} = this;
    this.intervalId = setInterval(() =>{
      changeSlideIndex.call(this, 1)();
    }, delay || 3000)
  }

  renderDot(index) {                                    // создаём точки
    const {changeSlideIndex} = this;
    const dotItem = document.createElement('div');
    dotItem.classList.add('slider_dots-item');
    dotItem.addEventListener('click', changeSlideIndex.call(this, null, index));
    if (this.dotContainer) this.dotContainer.appendChild(dotItem);

  }

  changeSlideIndex(controlIndex, slideIndex) {                    // Смена слайдов
    return () => {
      if (slideIndex != undefined) {
        this.slideIndex = slideIndex;
      } else {
        switch (controlIndex) {
          case 0:
            this.slideIndex = this.slideIndex-1;
            break;
          case 1:
            this.slideIndex = this.slideIndex+1;
            break;
        }
      }
      this.renderSlider();
    }
  }

  renderSlider() {                                                                  //действия при смене слайдов
    const {sliderItems, slideIndex, dotContainer, options: {fade = false}} = this;
    let dotItems;
    //Показ слайд/общее количество слайдов
    //console.log((this.slideIndex==sliderItems.length ? 1 : this.slideIndex==-1 ? sliderItems.length : (this.slideIndex + 1))  + '/' + sliderItems.length);
    if (dotContainer) {
      dotItems = dotContainer.childNodes; // Массив точек

      for (let i=0; i < dotItems.length; i++){ 
        dotItems[i].classList.remove('active');
      }
    };

    if(slideIndex < 0){
      this.slideIndex = sliderItems.length-1;
    };

    if (slideIndex > sliderItems.length - 1) {
      this.slideIndex = 0;
    }

    if (fade) {
      for (let i=0; i<sliderItems.length; i++){ 
        sliderItems[i].style.opacity = '0';
      }
      this.sliderItems[this.slideIndex].style.opacity = '1';
    } else {
      const contentBlock = this.getSliderContent();

      contentBlock.classList.add('fade-off');
      contentBlock.style.gridTemplateColumns = `repeat(${sliderItems.length}, 100%)`;

      for (let i=0; i<sliderItems.length; i++){ 
        sliderItems[i].classList.add('fade-off');
      }

      const step = contentBlock.clientWidth;
      
      contentBlock.style.left = `-${step * this.slideIndex}px`;

    }
    

    if (dotContainer) dotItems[this.slideIndex].classList.add('active');

  }

  swipeSlide() {
    /*Отмена перетаскивания слайдов */
    for (let i=0; i<this.sliderItems.length; i++){ 
      this.sliderItems[i].addEventListener('dragstart',(evn) => evn.preventDefault());
    }

    /*Реализация свайпа мышью*/
    this.sliderContainer.addEventListener('mousedown', handleMouseStart, false);
    this.sliderContainer.addEventListener('mousemove', handleMouseMove, false);
    document.body.addEventListener('mouseup', handleMouseUp, false);
    const contentBlock = this.getSliderContent();
    let xDown = null;
    let yDown = null;
    let left = null;
    const slider=this;

    function handleMouseStart(evt) {
    xDown = evt.clientX;
    yDown = evt.clientY;
    left = parseInt(contentBlock.style.left);
    contentBlock.style.transition = 'none';
    };

    function handleMouseMove(evt) {
      if ( ! xDown || ! yDown ) {
        return;
      };
      let xNow = evt.clientX;
      let xDragDiff = xDown - xNow;
      contentBlock.style.left = left - xDragDiff + 'px';
    }

    function handleMouseUp(evt) {
    if ( ! xDown || ! yDown ) {
    return;
    }

    let xUp = evt.clientX;
    let yUp = evt.clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    contentBlock.style.transition = 'all 1s ease';

    if ( Math.abs( xDiff ) >= Math.abs( yDiff ) ) {/* отлавливаем разницу в движении */
      if ( xDiff > 100 ) {
        /* swipe влево */
        slider.slideIndex=slider.slideIndex+1;
        slider.renderSlider();
        
      } else if (xDiff < -100 ) {
        /* swipe вправо */
        slider.slideIndex=slider.slideIndex-1;
        slider.renderSlider();
      } else if (xDiff < 10 && xDiff > -10 && evt.target.src) {
        slider.modalCreate(evt.target);
      } else {
        contentBlock.style.left = left + 'px';
      }
    };
      /* свайп был, обнуляем координаты */
      xDown = null;
      yDown = null;
    };

    /*Реализация свайпа на тач-скрине*/
    this.sliderContainer.addEventListener('touchstart', handleTouchStart, false);
    this.sliderContainer.addEventListener('touchmove', handleTouchMove, false);
    this.sliderContainer.addEventListener('touchend', handleTouchEnd, false);
        
    function handleTouchStart(evt) {
      const firstTouch = evt.touches[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      left = parseInt(contentBlock.style.left);
      contentBlock.style.transition = 'none';
    };
        
    function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) {
        return;
      };
      let xNow = evt.touches[0].clientX;
      let xDragDiff = xDown - xNow;
      contentBlock.style.left = left - xDragDiff + 'px';
    }

    function handleTouchEnd(evt) {
      if ( ! xDown || ! yDown ) {
        return;
      }
      let xUp = evt.changedTouches[0].clientX;
      let yUp = evt.changedTouches[0].clientY;
        
      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;

      contentBlock.style.transition = 'all .5s ease';
        
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/* отлавливаем разницу в движении */
        if ( xDiff > 100 ) {
          /* swipe влево */
          slider.slideIndex=slider.slideIndex+1;
          slider.renderSlider();
          
        } else if (xDiff < -100 ) {
          /* swipe вправо */
          slider.slideIndex=slider.slideIndex-1;
          slider.renderSlider();
        } else if ((xDiff<100 && xDiff>10) || (xDiff>-100 && xDiff<-10)) {
          contentBlock.style.left = left + 'px';
        }
      };
        /* свайп был, обнуляем координаты */
        xDown = null;
        yDown = null;
    };
  }

};

