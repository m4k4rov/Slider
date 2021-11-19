# Реализация слайдера под тач и десктоп.
Подключаем `slider.css` и `slider.js` из каталога src
## Базовая разметка
```html
  <div class="slider_box">
    <div class="slider_control">
      <div class="slider_control-item prev"></div>
      <div class="slider_control-item next"></div>
    </div>
    <div class="slider_dots"></div>
    <div class="slider_container">
      <div class="slider_content">
        <img src="./img/1.jpg" title="Вафельки" class="slider_content-item">
        <img src="./img/2.jpg" title="Дождь" class="slider_content-item">
        <img src="./img/3.jpg" title="Коньяк" class="slider_content-item">
        <img src="./img/4.jpg" title="Вкусняшки на тарелках" class="slider_content-item">
        <img src="./img/5.jpg" title="Кофе и фотоаппарат" class="slider_content-item">
        <img src="./img/6.jpg" title="Бутылка с перчиком" class="slider_content-item">
      </div>
    </div>
  </div>
```
## Инициализация слайдера
```javascript
const Slider = new SliderBox('.slider_box', { //Устанавливается селектор заглавного бокса, с width и height
      modal: false, //функция модального окна при клике на изображение
      autoPlay: false, //функция автоскроллинга
      fade: false,  //перелистывание слайдов с эффектом исчезновения
      startSlade: 1,  //стартовый слайд
      delay: 3000 // задержка при автоскроллинге
});
```
