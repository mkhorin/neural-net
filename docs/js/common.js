'use strict';

window.activePathName = location.pathname.match(new RegExp('([a-zA-Z-]+)\.html'))?.[1];

function escapeTags (text) {
    return typeof text === 'string'
        ? text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        : '';
}

// NAV BAR

jQuery('.navbar-target').append(`<div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand brand-en" href="./"></a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li><a href="${window.enLanguageLink || 'ru'}">${window.enLanguageLabel || 'RU'}</a></li>
        </ul>
      </div>
    </div>`);

// SIDE MENU

(function($) {
    const items = [{
        name: 'intro',
        label: 'Introduction',
        ru: 'Вступление'
    }, {
        name: 'training',
        label: 'Training neural network',
        ru: 'Обучение нейросети'
    }, {
        name: 'testing',
        label: 'Testing neural network',
        ru: 'Тестирование нейросети'
    }, {
        name: 'recognition',
        label: 'Recognition digits',
        ru: 'Распознавание цифр'
    }];
    const lang = document.documentElement.lang;
    const result = [];
    for (const item of items) {
        if (item.header) {
            const label = item[lang] || item.header;
            result.push(`<li class="nav-header"><a>${label}</a></li>`);
        } else {
            const active = item.name === activePathName ? 'active' : '';
            const label = item[lang] || item.label;
            result.push(`<li class="${active}"><a href="${item.name}.html">${label}</a></li>`);
        }
    }
    $('article > .row').append(
`<div class="col-md-3">
  <hr class="hidden-lg hidden-md">
  <ul class="side-menu nav nav-pills nav-stacked">${result.join('')}</ul>
</div>`);
})(jQuery);

// STEP CONTROL

(function ($) {
    const $items = $('.side-menu').children();
    if ($items.length) {
        const $controls = $('<div class="step-control"></div>');
        const $active = $items.filter('.active');
        const $prev = $active.prevAll().not('.nav-header').first();
        const $next = $active.nextAll().not('.nav-header').first();
        if ($prev.length) {
            $controls.append('<button class="btn-back btn-default btn">Back</button> ');
        }
        if ($next.length) {
            $controls.append('<button class="btn-next btn-primary btn">Next</button> ');
        }
        $controls.on('click', '.btn-back', () => $prev.find('a').get(0).click());
        $controls.on('click', '.btn-next', () => $next.find('a').get(0).click());
        $('article > div > div').first().append($controls);
    }
})(jQuery);

// IMAGE VIEWER

(function($) {

    $('.image-view').each((index, element) => {
        const src = element.getAttribute('src');
        const alt = element.getAttribute('alt');
        $(element).wrap(`<a href="${src}" class="viewer-item thumb-link" title="${alt}"></a>`);
    });

    const template =
        `<div class="image-viewer modal fade" id="image-viewer" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg unselectable">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">×</span></button>
        <h4 class="modal-title">#</h4>
      </div>
      <div class="modal-body">
        <div class="photo-viewport">
          <div class="control prev">
            <div><i class="glyphicon glyphicon-triangle-left"></i></div>
          </div>
          <div class="control next">
            <div><i class="glyphicon glyphicon-triangle-right"></i></div>
          </div>
          <div class="photo-container"><img src="" class="photo-face"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
    const $viewer = $(template);
    $(document.body).append($viewer);

    const $title = $viewer.find('.modal-title');
    const $viewport = $viewer.find('.photo-viewport');
    const $face = $viewport.find('.photo-face');
    const $prev = $viewport.find('.prev').click(()=> jumpToNext(-1));
    const $next = $viewport.find('.next').click(()=> jumpToNext(1));

    let $items = [];
    let currentIndex;

    $(document.body).on('click', 'a.viewer-item', function (event) {
        event.preventDefault();
        const $list = $(this).closest('.viewer-list');
        $items = $('a.viewer-item', $list.length ? $list : null);
        currentIndex = $items.index(this);
        if (currentIndex < 0) {
            return false;
        }
        $face.get(0).src = '';
        // hide icon of the empty image
        $face.addClass('invisible');
        loadImage();
        $viewer.modal('show');
    });

    $face.on('load', ()=> {
        $viewport.removeClass('loading');
        $face.removeClass('invisible');
        $(window).resize(); // update overlay size
    });

    function jumpToNext(step) {
        const index = currentIndex + step;
        if (index < 0 || index >= $items.length) {
            return false;
        }
        currentIndex = index;
        loadImage();
    }

    function loadImage() {
        const $item = $items.eq(currentIndex);
        $viewport.addClass('loading');
        const title = $item.attr('title');
        $title.html(title ? title : '#');
        setTimeout(function(){
            $face.get(0).src = $item.attr('href');
        }, 0);
        $prev.toggle(!!currentIndex);
        $next.toggle(currentIndex !== $items.length - 1);
    }
})(jQuery);