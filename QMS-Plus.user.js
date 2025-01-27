// ==UserScript==
// @name         QMS Plus
// @namespace    4PDA
// @version      0.8.1
// @description  Юзерскрипт для добавления/исправления функционала QMS на форуме 4PDA
// @author       CopyMist, R3m
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ru
// @icon         https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/icon-128.png
// @homepage     https://4pda.ru/forum/index.php?showtopic=985927
// @downloadURL  https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/QMS-Plus.user.js
// @updateURL    https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/QMS-Plus.meta.js
// @match        https://4pda.ru/forum/index.php?act=qms*
// @match        https://4pda.to/forum/index.php?act=qms*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tippy.js/5.2.1/tippy-bundle.iife.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @resource     backgroundSvg https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/background.svg
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==

/* global $, _, tippy */

/*
 * Стили
 */
function addCustomStyles() {
  const cssCode = [
    '.body-tbl svg { height: 100%; padding: 1%; }',
    '.header, #contacts, #body, .footer, .navbar, .navbar .nav-left, .navbar .nav, .navbar .nav-right { transition: none; }',
    // Выпадающий список
    '.logo-in-qms .dropdown .chk-wrap { display: flex; align-items: center; }',
    '.logo-in-qms .dropdown .chk-left { width: 13px; height: 13px; margin: 1px 0 0 20px; }',
    '.logo-in-qms .dropdown .chk-right { display: block; padding: 3px 20px 3px 7px; white-space: nowrap; }',
    '.logo-in-qms .dropdown + .dropdown { margin-left: 10px; }',
    '.dropdown-menu > li > a:hover, .dropdown .chk-wrap:hover { background-color: #E4EAF2; }',
    '.dropdown .chk-wrap > input:hover, .dropdown .chk-wrap > label:hover { cursor: pointer; }',
    // Всплывающие подсказки
    '.tippy-tooltip { background-color: #eaf4ff; color: #4373c3; font-weight: bold; }',
    '.tippy-tooltip[data-placement^=top]>.tippy-arrow { border-top-color: #eaf4ff; }',
    '.tippy-tooltip[data-placement^=bottom]>.tippy-arrow { border-bottom-color: #eaf4ff; }',
    '.tippy-tooltip[data-placement^=left]>.tippy-arrow { border-left-color: #eaf4ff; }',
    '.tippy-tooltip[data-placement^=right]>.tippy-arrow { border-right-color: #eaf4ff; }',
    // Скрытие шапки и подвала
    'body.hide-header .holder-no-hidden, body.hide-header .menu-main-mobile { display: none; }',
    'body.hide-header .navbar { top: 0; }',
    'body.hide-header .header { height: 42px; max-height: 42px; }',
    'body.hide-header #contacts, body.hide-header #body { top: 42px; }',
    'body.hide-footer .footer { display: none; }',
    'body.hide-footer #contacts, body.hide-footer #body { bottom: 0; }',
    // Полоса прокрутки
    'body.custom-scroll .scrollframe::-webkit-scrollbar { width: 13px; }',
    'body.custom-scroll #scroll-contacts::-webkit-scrollbar { width: 7px; }',
    'body.custom-scroll .scrollframe::-webkit-scrollbar-track { background-color: #fff; border: 0; }',
    'body.custom-scroll .scrollframe::-webkit-scrollbar-thumb { background: linear-gradient(to right, #E0EEFF, #C6E0FF); border: 1px solid #C6E0FF; border-right: 0; }',
    'body.custom-scroll .scrollframe::-webkit-scrollbar-thumb:hover { background: #e0eeff; }',
    'body.custom-scroll .scrollframe::-webkit-scrollbar-thumb:active { background-color: #C6E0FF; }',
    'body.custom-scroll .scrollframe > .scrollframe-body { transform: none !important; padding-bottom: 0; }',
    'body.custom-scroll #scroll-contacts .list-group-item { margin-left: 7px; padding-left: 5px; }',
    // Форма поиска
    'body.move-search .qms-search-form { display: inline-flex !important; height: auto; min-height: auto; background: transparent; border: 0; margin: 0 !important; padding: 0; }',
    'body.move-search .qms-search-form > div { float: none !important; margin: 0 !important; padding: 0 !important; }',
    'body.move-search .qms-search-form > .btn { margin: 0; }',
    'body.move-search .qms-search-form .form-input { border-right: 0; }',
    'body.move-search .qms-search-form > .icon-close { display: none; }',
    'body.move-search .nav-right > .dropdown:last-child li:first-child { display: none; }',
    'body.move-search .logo-in-qms .nav-right > .btn { margin-left: 6px; margin-right: 3px; }',
    'body.move-search .logo-in-qms .nav-right { padding-left: 0; }',
    'body.move-search .logo-in-qms .nav-left { padding-right: 10px; }',
    'body.move-search #body { padding-top: 0 !important; }',
    // Расширяемая форма ввода
    'div#threads-bottom-form::after, div#thread-bottom-form::after, div#create-thread-div-form::after { content: "‾‾‾‾‾‾‾‾‾‾‾‾‾"; background-color: #e0eeff; border-bottom: #c6e0ff solid 1px; position: absolute; top: 0; width: 100%; height: 6px; font-size: 8px; text-align: center; cursor: ns-resize; }',
    'div.form-thread[data-form="send-message"], div.form-thread[data-form="create-thread"], form.form-thread { display:flex; flex-direction: column; height: 100%; }',
    '#threads-form [name="message"], #thread-form [name="message"], .form-thread [name="message"] { height: 100%; }',
    'div.body-tbl { max-height: calc(100% - 200px); }',
    'div#threads-bottom-form, div#thread-bottom-form, div#create-thread-div-form { min-height: 200px; }',
    // Компактность списка контактов
    '.list-group .list-group-item { padding-top: 8px !important; padding-bottom: 8px !important; }',
    // Более крупная точка непрочитанного сообщения
    '.big-dot { width: 1em; height: 1em; }',
    // Избранное
    '.starred { background: #2982cc; overflow-y: auto; max-height: 270px; border-bottom: #2982cc solid 7px; }',
    '.starred::-webkit-scrollbar { width: 7px; }',
    '.starred-header { text-align: center; color: #FFF; }',
    '.list-group .list-group-item .bage .icon-starred { padding: 0; margin: 0; background: transparent; color: #babdbe; }',
    'a:hover .icon-starred:before, .always-show-icons .icon-starred:before { content: "\u2606"; }',
    'a:hover .icon-starred:hover:before, .always-show-icons .icon-starred:hover:before { content: "\u2605"; }',
    '.starred a:hover .icon-starred:before, .always-show-icons .starred .icon-starred:before { content: "\u2605"; }',
    '.starred a:hover .icon-starred:hover:before, .always-show-icons .starred .icon-starred:hover:before { content: "\u2606"; }',
    '.starred a:hover .icon-moveup:before, .always-show-icons .starred .icon-moveup:before { content: "\u25b3"; }',
    '.starred a:hover .icon-moveup:hover:before, .always-show-icons .starred .icon-moveup:hover:before { content: "\u25b2"; }',
    '.starred a:hover .icon-movedown:before, .always-show-icons .starred .icon-movedown:before { content: "\u25bd"; }',
    '.starred a:hover .icon-movedown:hover:before, .always-show-icons .starred .icon-movedown:hover:before { content: "\u25bc"; }',
    '.hide { display: none !important }',
    // Предпросмотр сообщений
    '.logo-in-qms #message-preview { position: absolute; bottom: 0; width: -webkit-fill-available; margin: 0 24px 0 12px; padding: 8px; background-color: #e4eaf2; border: #c6e0ff solid 3px; }',
    '#create-thread-form #message-preview { bottom: 92px; z-index: 15; }',
    // Облака сообщений
    '.list-group .list-group-item[data-message-id]:not(.our-message) { margin: 10px 30px 0 0; border-radius: 0 10px 10px 0; position: relative; background-color: #f0f4f9; }',
    '.list-group .list-group-item.our-message { margin: 10px 0 0 30px; border-radius: 10px 0 0 10px; position: relative; background-color: #e0eeff; }',
    '.list-group .list-group-item[data-message-id]:not(.our-message)::before { content: ""; position: absolute; width: 0; height: 0; top: 12px; border-top: 12px solid transparent; border-left: 20px solid #f0f4f9; border-bottom: 8px solid transparent; right: -12px; }',
    '.list-group .list-group-item.our-message::before { content: ""; position: absolute; width: 0; height: 0; left: -12px; top: 12px; border-top: 12px solid transparent; border-right: 20px solid #e0eeff; border-bottom: 8px solid transparent; }',
    //Печатает...
    '#thread-bottom-form:before {left: 1em !important; top: -1.2em; font-size: 12px; content: "Печатает " url("data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjZweCIgdmlld0JveD0iMCAwIDEyOCAzMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBmaWxsPSIjNWM1YzVjIiBjeD0iMCIgY3k9IjAiIHI9IjExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNiAxNikiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGFkZGl0aXZlPSJzdW0iIHZhbHVlcz0iMTsxLjQyOzE7MTsxOzE7MTsxOzE7MSIgZHVyPSI5MDBtcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2NpcmNsZT48Y2lyY2xlIGZpbGw9IiM1YzVjNWMiIGN4PSIwIiBjeT0iMCIgcj0iMTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0IDE2KSI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYWRkaXRpdmU9InN1bSIgdmFsdWVzPSIxOzE7MTsxOzEuNDI7MTsxOzE7MTsxIiBkdXI9IjkwMG1zIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0iIzVjNWM1YyIgY3g9IjAiIGN5PSIwIiByPSIxMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEyIDE2KSI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYWRkaXRpdmU9InN1bSIgdmFsdWVzPSIxOzE7MTsxOzE7MTsxOzEuNDI7MTsxIiBkdXI9IjkwMG1zIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjwvc3ZnPg==") !important;}',
    '#scroll-thread .scrollframe-body {margin-bottom: 20px;}'
  ];
  GM_addStyle(cssCode.join('\n'));
}

/*
 * Глобальные переменные
 */
const options = GM_getValue('options', {
  'hide-header': true,
  'hide-footer': true,
  'smooth-disable': true,
  'move-search': true,
  'show-preview': true,
  'show-last-message-time': true,
  'always-show-fav-icons': false,
  'search-contacts': false
});

const qmsClass = '.logo-in-qms';

const bgSvg = GM_getResourceText('backgroundSvg');
const settingsHtml = `
<div class="dropdown" id="qms-plus">
    <a href="#" class="btn" title="Настройки QMS Plus" data-toggle="dropdown">
        <i class="icon-cog"></i>
        <span class="on-show-sidebar">QMS Plus</span>
        <i class="icon-down-dir-1"></i>
    </a>
    <ul class="dropdown-menu pull-right">
        ${optionHtml('hide-header', 'Скрывать шапку (header)', options['hide-header'])}
        ${optionHtml('hide-footer', 'Скрывать подвал (footer)', options['hide-footer'])}
        ${optionHtml('smooth-disable', 'Убрать плавную прокрутку', options['smooth-disable'])}
        ${optionHtml('move-search', 'Вынести поиск в панель', options['move-search'])}
        ${optionHtml('show-preview', 'Кнопка предпросмотра сообщения', options['show-preview'])}
        ${optionHtml(
          'show-last-message-time',
          'Показывать время последнего сообщения в избранном',
          options['show-last-message-time'])}
        ${optionHtml(
          'always-show-fav-icons',
          'Всегда показывать иконки избранного и сортировки',
          options['always-show-fav-icons'])}
        ${optionHtml(
          'search-contacts',
          'Быстрый поиск контакта по имени',
          options['search-contacts'])}
    </ul>
</div>`;
const BORDER_SIZE = 6;
let m_pos;

/*
 * Функции
 */

function optionHtml(name, title, checked) {
  return `
<div class="chk-wrap clearfix">
    <input class="checkbox chk-left" type="checkbox" name="${name}" value="1" id="${name}"
    ${checked ? 'checked="checked"' : ''}>
    <label class="chk-right" for="${name}">${title}</label>
</div>`;
}

function initSettings() {
  const $settings = $('#qms-plus');

  $settings.find('.checkbox').on('change', function () {
    options[this.name] = this.checked;
    GM_setValue('options', options);
    $settings[0]._tippy.show();
  });

  tippy('#qms-plus', {
    content: 'Сохранено. Обновите страницу (F5)',
    trigger: 'manual',
    distance: 3
  });
}

function removeNiceScroll($selector) {
  const $scrolls = $selector.getNiceScroll();

  if ($scrolls.length) {
    $scrolls.remove();

    $scrolls.each(function () {
      // Крутим вниз, если диалог
      const $element = $(this.opt.win[0]);
      if ($element.attr('id') === 'scroll-thread') {
        setTimeout(() => {
          $element.scrollTop($element[0].scrollHeight);
        }, 100);
      }
    });
  }
}

function onFavorite(item) {
  const $item = $(item);
  const memberId = $item.attr('data-member-id');
  let favs = GM_getValue('favs', []);
  favs.push(memberId);
  GM_setValue('favs', [...new Set(favs.filter(Boolean))]);
  const $newItem = $item.clone();
  $item.addClass('hide');
  const $footer = $('#contacts .list-group .starred-footer');
  $footer.before($newItem);
  $($newItem).find('.icon-starred').on('click', event => {
    event.preventDefault();
    onUnfavorite(item, $newItem[0])
  });
  $($newItem).find('.icon-moveup').on('click', event => {
    event.preventDefault();
    moveFavUp($newItem[0]);
  });
  $($newItem).find('.icon-movedown').on('click', event => {
    event.preventDefault();
    moveFavDown($newItem[0]);
  });
}

function onUnfavorite(item, newItem) {
  const $item = $(item);
  const memberId = $item.attr('data-member-id');
  let favs = GM_getValue('favs');
  favs.splice(favs.indexOf(memberId), 1);
  GM_setValue('favs', favs.filter(Boolean));
  $(newItem).remove();
  $item.removeClass('hide');
  $item.find('.icon-starred').on('click', event => {
    event.preventDefault();
    onFavorite(item);
  });
}

function addFavs() {
  let favs = GM_getValue('favs', []);
  favs.forEach(fav => {
    const $item = $(qmsClass + ' [data-member-id="' + fav + '"]');
    onFavorite($item[0]);
  });
}

function addBottomFormListener() {
  const bottomForms = [
    '#threads-bottom-form',
    '#thread-bottom-form',
    '#create-thread-div-form'
  ];
  bottomForms.forEach(bottomForm => {
    if ($(bottomForm).length) {
      $(bottomForm).on("mousedown", bottomFormMouseDown)
    }
    $(qmsClass).arrive(bottomForm, () => {
      $(bottomForm).on("mousedown", bottomFormMouseDown)
    });
  });
}

function bottomFormMouseDown(e) {
  if (e.offsetY < BORDER_SIZE) {
    m_pos = e.clientY;
    $(document).on("mousemove", resizePanel);
  }
}

function resizePanel(e) {
  const dy = m_pos - e.clientY;
  m_pos = e.clientY;
  const $threadsList = $('div.body-tbl');
  $threadsList.height($threadsList.height() - dy);
  const $bottomForm = $('#threads-bottom-form, #thread-bottom-form, #create-thread-div-form');
  $bottomForm.height($bottomForm.height() + dy);
}

function mouseUp() {
  $(document).off("mousemove", resizePanel);
}

function expandBBCodes() {
  const panel = $('#panel-bb-codes');
  if (panel.attr('class') && !panel.attr('class').includes('show')) {
    $('#btn-bb-codes').click()
  }
}

function insertAndShift(arr, from, to) {
  let cutOut = arr.splice(from, 1)[0]; // cut the element at index 'from'
  arr.splice(to, 0, cutOut); // insert it at index 'to'
}

function moveFavUp(item) {
  const memberId = $(item).attr('data-member-id');
  let favs = GM_getValue('favs') || [];
  const memberIndex = favs.indexOf(memberId);
  if (memberIndex > 0) {
    insertAndShift(favs, memberIndex, memberIndex - 1);
    GM_setValue('favs', favs.filter(Boolean));
    const prevMemb = $(item).prevAll()[0];
    $(prevMemb).before($(item));
  }
}

function moveFavDown(item) {
  const memberId = $(item).attr('data-member-id');
  let favs = GM_getValue('favs') || [];
  const memberIndex = favs.indexOf(memberId);
  if (memberIndex > -1 && memberIndex < favs.length) {
    insertAndShift(favs, memberIndex, memberIndex + 1);
    GM_setValue('favs', favs.filter(Boolean));
    const nextMemb = $(item).nextAll()[0];
    $(nextMemb).after($(item));
  }
}

function addStarredDivs() {
  if (!$('.starred').length) {
    const $contacts = $('#contacts .list-group');
    if (options['always-show-fav-icons']) $contacts.addClass('always-show-icons');
    $contacts.prepend(`
        <div class="starred">
            <div class="starred-header"><span>Избранное</span></div>
            <div class="starred-footer"></div>
        </div>
    `);
  }
}

function addStarBadges() {
  $('#contacts .list-group .list-group-item').each((index, item) => {
    const $item = $(item);
    const $iconClose = $item.find('.bage .icon-close');

    const $iconUp = $('<i>', {
      type: 'button',
      class: 'icon-moveup',
      title: 'Поднять выше'
    }).insertBefore($iconClose);

    const $iconDown = $('<i>', {
      type: 'button',
      class: 'icon-movedown',
      title: 'Опустить ниже'
    }).insertBefore($iconClose);

    const $iconStar = $('<i>', {
      type: 'button',
      class: 'icon-starred',
      title: 'Добавить в избранное'
    }).insertBefore($iconClose);

    $iconStar.on('click', event => {
      event.preventDefault();
      onFavorite(item);
    });

    $iconUp.on('click', event => {
      event.preventDefault();
      moveFavUp(item);
    });

    $iconDown.on('click', event => {
      event.preventDefault();
      moveFavDown(item);
    });
  });
}

async function contactsDate() {
  const $contactsList = $('#contacts .list-group .starred a.list-group-item');
  const delay = ms => new Promise(res => setTimeout(res, ms));
  for (const contact of $contactsList) {
    await addContactDate(contact);
    await delay(500);
  }
}

async function addContactDate(contact) {
  const contactDate = await getContactDate(contact.href);
  if (contactDate) {
    const $contact = $(contact);
    $contact.append($('<br/>'));
    const $span = $('<i>').css({
      paddingLeft: '48px',
      fontSize: '8pt'
    }).text(contactDate);
    $contact.append($span);
  }
}

function getContactDate(link) {
  return new Promise(resolve => {
    if (link.endsWith("mid=0")) return resolve();
    $.get(link, response => {
      const $doc = $(response);
      const text = $doc.find('#threads-form a.list-group-item div.bage.fixed.right').first().text();
      resolve(text);
    }).fail(e => {
      console.error(e);
      resolve();
    });
  });
}

function showPreviewButton() {
  const $showPreview = $(`
    <div class="block" style="margin-top: 8px;">
        <button id="show-message-preview" class="btn block blue">Предпросмотр</button>
    </div>`);
  $('#submit-without-attach-file').after($showPreview);
  const messagePreview = '#message-preview';
  $('#show-message-preview').on('click', event => {
    event.preventDefault();
    if ($(messagePreview).length) {
      $(messagePreview).remove();
    } else {
      const $bodyTbl = $('div.body-tbl');
      const $container = $bodyTbl.length ? $bodyTbl : $('form#create-thread-form');
      $container.append('<div id="message-preview"></div>');
      $(messagePreview).html(preparePreview());
    }
  });
}

function preparePreview() {
  const message = $('textarea.form-input.block').val();
  return recurseCode(message);
}

function recurseCode(message) {
  const regexCode = new RegExp("([\\s\\S]*?)\\[(code|CODE)]([\\s\\S]*?)\\[\\/(code|CODE)]([\\s\\S]*)", "g");
  const codeResult = regexCode.exec(message);
  if (codeResult) {
    return messageFormatter(codeResult[1]) + formatCode(codeResult[3]) + recurseCode(codeResult[5]);
  } else {
    return messageFormatter(message);
  }
}

function formatCode(message) {
  return `<div class="post-block code unbox">
    <div class="block-title"></div>
    <div class="block-body">${message}</div>
  </div>`;
}

function messageFormatter(message) {
  const regexStyle = new RegExp("\\[(\\/)?([bisu]|sub|sup)]", "ig");
  const regexAlign1 = new RegExp("\\[(left|center|right)]", "ig");
  const regexAlign2 = new RegExp("\\[\\/(left|center|right)]", "ig");
  const regexUrl1 = new RegExp('\\[(url|URL)=(.*?)]', "g");
  const regexUrl2 = new RegExp("\\[\\/url]", "ig");
  const regexQuote1 = new RegExp("\\[quote]", "ig");
  const regexBlockEnd = new RegExp("\\[\\/(quote|spoiler)]", "ig");
  const regexOfftop1 = new RegExp("\\[offtop]", "ig");
  const regexOfftop2 = new RegExp("\\[\\/offtop]", "ig");
  const regexSpoil1 = new RegExp("\\[spoiler]", "ig");
  const regexSpoil2 = new RegExp("\\[(spoiler|SPOILER)=(.*?)]", "g");
  const regexListHead = new RegExp("\\[list(=1)?]", "ig");
  const regexListItem = new RegExp("\\[\\*]([\\s\\S]*?)(?=\\[(\\/list|\\*)])", "g")
  const regexListTail = new RegExp("\\[\\/list]", "ig");

  // noinspection HtmlUnknownTarget
  return message.replace(/\r\n|\r|\n/g, '<br/>')
    .replace(regexStyle, '<$1$2>')
    .replace(regexAlign1, '<div style="text-align:$1;">')
    .replace(regexAlign2, '</div>')
    .replace(regexUrl1, '<a rel="nofollow" href="$2" target="_blank">')
    .replace(regexUrl2, '</a>')
    .replace(regexQuote1, '<div class="post-block quote"><div class="block-title"></div><div class="block-body">')
    .replace(regexBlockEnd, '</div></div>')
    .replace(regexOfftop1, '<span style="font-size:9px; color: gray;">')
    .replace(regexOfftop2, '</span>')
    .replace(
      regexSpoil1,
      `<div class="post-block spoil open">
        <div class="block-title" title="В предпросмотре спойлер не сворачиваемый"></div>
        <div class="block-body">`)
    .replace(
      regexSpoil2,
      `<div class="post-block spoil open">
        <div class="block-title" title="В предпросмотре спойлер не сворачиваемый">$2</div>
        <div class="block-body">`)
    .replace(regexListHead, '<ul>')
    .replace(regexListItem, '<li>$1</li>')
    .replace(regexListTail, '</ul>');
}

function addSearchContacts() {
  $('<div>', {
    id: "contact-search-container"
  }).append($('<input>', {
    type: "text",
    id: "contact-search-input",
    class: "form-input block",
    placeholder: "Поиск контакта..."
  })).insertBefore("#scroll-contacts");

  GM_addStyle(`
#contact-search-input {
  width: 96%;
  margin: 4px;
}
.highlight {
    background-color: orange;
    color: blueviolet;
}
.hidden {
    display: none !important;
}`);

  $('#contact-search-input').on('input', function () {
    const searchText = $(this).val().toLowerCase();
    $('#contacts .list-group-item').each(function() {
      const $item = $(this);
      const itemText = $item.find('.text-overflow').text().toLowerCase();
      if (itemText.includes(searchText)) {
        $item.removeClass('hidden');
        const regExp = new RegExp('(' + searchText + ')', 'gi');
        const newHtml = $item.find('.text-overflow').text().replace(regExp, '<span class="highlight">$1</span>');
        $item.find('.text-overflow')
          .html('<div class="avatar-wrap">' + $item.find('.avatar-wrap').html() + '</div>' + newHtml);
      } else {
        $item.addClass('hidden');
      }
    });
  });
}

/*
 * До document.ready
 */

// Замена SVG-смайлика на свой фон "QMS Plus"
$(qmsClass).find('.body-tbl svg').replaceWith(bgSvg);
$(qmsClass).arrive('.body-tbl', function () {
  $('.body-tbl svg').replaceWith(bgSvg);
});

// Добавление дропдауна "QMS Plus"
$(qmsClass).find('.nav-right > .dropdown').before(settingsHtml);
$(qmsClass).arrive('.navbar', function () {
  if (!$('#qms-plus').length) {
    $('.nav-right > .dropdown').before(settingsHtml);
    initSettings();
  }
});

// Скрытие шапки
if (options['hide-header']) {
  $('body').addClass('hide-header');
}

// Скрытие подвала
if (options['hide-footer']) {
  $('body').addClass('hide-footer');
}

//Развернуть панель BB-кодов
// noinspection JSJQueryEfficiency
if ($('#panel-bb-codes').length) expandBBCodes();
$(qmsClass).arrive('#panel-bb-codes', expandBBCodes);

/*
 * После document.ready
 */

$(document).ready(async function () {
  addCustomStyles();
  initSettings();

  // Доступ к родному jQuery форума
  const $u = unsafeWindow.$;

  if (options['smooth-disable']) {
    $('body').addClass('custom-scroll');

    // Убираем jQuery.NiceScroll
    removeNiceScroll($u('[data-scrollframe-init]'));
    $(qmsClass).arrive('.nicescroll-rails', function() {
      removeNiceScroll($u(this).parent());
    });

    // Крутим при новых сообщениях
    $(qmsClass).arrive('[data-message-id]', _.debounce(function() {
      this.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 100));
  }

  // Название кнопки "Отправить"
  $('#submit-with-attach-file [type="submit"]').val('Отправить (Ctrl+Enter)')
    .closest('div.block').next().next().remove();
  $(qmsClass).arrive('#submit-with-attach-file', function() {
    $(this).find('[type="submit"]').val('Отправить (Ctrl+Enter)')
      .closest('div.block').next().next().remove();
  });

  // Перенос поиска в панель
  if (options['move-search']) {
    const $searchForm = $('#qms-search-form');
    $('body').addClass('move-search');

    if ($searchForm.length) {
      $searchForm.prependTo('.navbar > .nav-right');
    }

    $(qmsClass).arrive('#qms-search-form', function() {
      $(this).prependTo('.navbar > .nav-right');
    });
  }

  // Изменение размера панели отправки сообщения
  addBottomFormListener();
  $(document).on("mouseup", mouseUp);

  //Поиск контакта
  if (options['search-contacts']) addSearchContacts();

  // Предпросмотр сообщения
  if (options['show-preview']) {
    if ($('#submit-without-attach-file').length) showPreviewButton();
    $(qmsClass).arrive('#submit-without-attach-file', showPreviewButton);
  }

  // Избранное
  if ($('#contacts .list-group').length) {
    addStarredDivs();
    addStarBadges();
    addFavs();
    //выводить дату последнего сообщения рядом с контактом избранного
    if (options['show-last-message-time']) {
      await contactsDate();
    }
  }
  $(qmsClass).arrive('#contacts .list-group', async () => {
    addStarredDivs();
    addStarBadges();
    addFavs();
    //выводить дату последнего сообщения рядом с контактом избранного
    if (options['show-last-message-time']) {
      await contactsDate();
    }
  });
});
