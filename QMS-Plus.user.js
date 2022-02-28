// ==UserScript==
// @name         QMS Plus
// @namespace    4PDA
// @version      0.4.2
// @description  Юзерскрипт для добавления/исправления функционала QMS на форуме 4PDA
// @author       CopyMist, R3m
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ru
// @icon         https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/icon-128.png
// @homepage     https://4pda.ru/forum/index.php?showtopic=985927
// @downloadURL  https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/QMS-Plus.user.js
// @updateURL    https://raw.githubusercontent.com/IamR3m/QMS-Plus/master/QMS-Plus.meta.js
// @match        https://4pda.ru/forum/*act=qms*
// @match        https://4pda.to/forum/*act=qms*
// @match        http://4pda.ru/forum/*act=qms*
// @match        http://4pda.to/forum/*act=qms*
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
    '.starred-header { margin-left: 7px; padding-left: 5px; text-align: center; background: #2982cc; color: #FFF; }',
    '.starred-footer { height: 6px; background: #2982cc; margin-left: 7px; border-top: #79bdf5 solid 1px; }',
    '.list-group .list-group-item .bage .icon-starred { padding: 0; margin: 0; background: transparent; color: #babdbe; }',
    '.icon-starred:before { content: "\u2606"; }',
    '.icon-starred:hover:before { content: "\u2605"; }',
    '.starred .icon-starred:before { content: "\u2605"; }',
    '.starred .icon-starred:hover:before { content: "\u2606"; }',
    '.hide { display: none !important }',
].join('\n');
GM_addStyle(cssCode);

/*
 * Функции
 */

function optionHtml(name, title, checked) {
    let result = '<div class="chk-wrap clearfix">' +
        '<input class="checkbox chk-left" type="checkbox" name="' + name + '" value="1" id="' + name + '"';

    if (checked) {
        result += ' checked="checked"';
    }

    result += '><label class="chk-right" for="' + name + '">' + title + '</label></div>';
    return result;
}

function initSettings() {
    const $settings = $('#qms-plus');

    $settings.find('.checkbox').change(function() {
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

        $scrolls.each(function() {
            // Крутим вниз, если диалог
            var element = this.opt.win[0];
            if (element.id === 'scroll-thread') {
                setTimeout(function() {
                    element.scrollTop = element.scrollHeight;
                }, 100);
            }
        });
    }
}

/*
 * Глобальные переменные
 */

let options = GM_getValue('options');
if (!options) {
    options = {
        'hide-header': true,
        'hide-footer': true,
        'smooth-disable': true,
        'move-search': true
    };
    GM_setValue('options', options);
}

const qmsClass = '.logo-in-qms';

const bgSvg = GM_getResourceText('backgroundSvg');
const settingsHtml = '' +
    '<div class="dropdown" id="qms-plus">' +
    '<a href="#" class="btn" title="Настройки QMS Plus" data-toggle="dropdown">' +
    '<i class="icon-cog"></i><span class="on-show-sidebar">QMS Plus</span><i class="icon-down-dir-1"></i>' +
    '</a>' +
    '<ul class="dropdown-menu pull-right">' +
    optionHtml('hide-header', 'Скрывать шапку (header)', options['hide-header']) +
    optionHtml('hide-footer', 'Скрывать подвал (footer)', options['hide-footer']) +
    optionHtml('smooth-disable', 'Убрать плавную прокрутку', options['smooth-disable']) +
    optionHtml('move-search', 'Вынести поиск в панель', options['move-search']) +
    '</ul>' +
    '</div>';
const BORDER_SIZE = 6;
let m_pos;

/*
 * До document.ready
 */

// Замена SVG-смайлика на свой фон "QMS Plus"
$(qmsClass).find('.body-tbl svg').replaceWith(bgSvg);
$(qmsClass).arrive('.body-tbl', function() {
    $('.body-tbl svg').replaceWith(bgSvg);
});

// Добавление дропдауна "QMS Plus"
$(qmsClass).find('.nav-right > .dropdown').before(settingsHtml);
$(qmsClass).arrive('.navbar', function() {
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
if ($('#panel-bb-codes').length) expandBBCodes();
$(qmsClass).arrive('#panel-bb-codes', expandBBCodes);

function expandBBCodes() {
    const panel = $('#panel-bb-codes');
    if (panel.attr('class') && !panel.attr('class').includes('show')) {
        $('#btn-bb-codes').click()
    }
}

/*
 * После document.ready
 */

$(function() {
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
            this.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    document.addEventListener("mouseup", mouseUp, false);

    // Избранное
    addStarredDivs();
    addStarBadges();
    addFavs();
});

function addBottomFormListener() {
    const bottomForms = [
        '#threads-bottom-form',
        '#thread-bottom-form',
        '#create-thread-div-form'
    ];
    for (const bottomForm of bottomForms) {
        if ($(bottomForm).length) {
            $(bottomForm).on("mousedown", mouseDown)
        }
        $(qmsClass).arrive(bottomForm, () => {
            $(bottomForm).on("mousedown", mouseDown)
        });
    }
}

function resizePanel(e) {
    const dy = m_pos - e.y;
    m_pos = e.y;
    const threadsList = $('div.body-tbl');
    threadsList.height(threadsList.height() - dy);
    const bottomForm = $('#threads-bottom-form, #thread-bottom-form, #create-thread-div-form');
    bottomForm.height(bottomForm.height() + dy)
}

function mouseDown(e) {
    if (e.offsetY < BORDER_SIZE) {
        m_pos = e.y;
        document.addEventListener("mousemove", resizePanel, false)
    }
}

function mouseUp() {
    document.removeEventListener("mousemove", resizePanel, false)
}

function addStarredDivs() {
    $('#contacts .list-group')
        .prepend('<div class="starred"><div class="starred-header"><span>Избранное</span></div><div class="starred-footer"></div></div>')
}

function addStarBadges() {
    $(qmsClass).find('#contacts .list-group .list-group-item').each((index, item) => {
        const iconClose = $(item).find('.bage .icon-close');
        const iconStar = document.createElement('i');
        iconStar.type = 'button';
        iconStar.className = 'icon-starred';
        iconStar.title = 'Добавить в избранное';
        iconStar.onclick = (event) => {
            event.preventDefault();
            onFavorite(item)
        }
        iconClose.before(iconStar)
    })
}

function onFavorite(item) {
    const memberId = $(item).attr('data-member-id');
    let favs = GM_getValue('favs') || [];
    favs.push(memberId);
    GM_setValue('favs', [...new Set(favs)]);
    const newItem = $(item).clone();
    $(item).addClass('hide');
    const footer = $('#contacts .list-group .starred-footer');
    footer.before(newItem);
    const iconStar = $(newItem).find('.icon-starred')[0];
    iconStar.onclick = (event) => {
        event.preventDefault();
        console.log('unfav');
        onUnfavorite(item, newItem)
    }
}

function onUnfavorite(item, newItem) {
    const memberId = $(item).attr('data-member-id');
    let favs = GM_getValue('favs');
    favs.splice(favs.indexOf(memberId), 1);
    GM_setValue('favs', favs);
    $(newItem).remove();
    $(item).removeClass('hide');
    const iconStar = $(item).find('.icon-starred')[0];
    iconStar.onclick = (event) => {
        event.preventDefault();
        onFavorite(item)
    }
}

function addFavs() {
    let favs = GM_getValue('favs') || [];
    favs.forEach(fav => {
        const item = $(qmsClass + ' [data-member-id="' + fav + '"]');
        onFavorite(item)
    })
}