'use strict';

const isChromium = typeof window.chrome !== 'undefined';
const isFirefox = typeof window.browser !== 'undefined';
const browser = isFirefox ? window.browser : window.chrome;

var onOff = document.querySelector('input[name=checkbox_ad]');
var blockingMessage = document.querySelector('input[name=checkbox_ad_msg]');
var forcedQuality = document.querySelector('select[name=dropdown_forced_quality]');
var proxy = document.querySelector('select[name=dropdown_proxy]');
var proxyQuality = document.querySelector('select[name=dropdown_proxy_quality]');
var adTime = document.querySelector('#ad_time');
var excludedChannels = document.querySelector('textarea[name=excluded_channels]');


var allSettingsElements = [onOff,blockingMessage,forcedQuality,proxy,proxyQuality,excludedChannels];

for (var i = 0; i < allSettingsElements.length; i++) {
    if (allSettingsElements[i]) {
        allSettingsElements[i].addEventListener('change', function() {
            saveOptions();
        });
    }
}

function saveOptions() {
    chrome.storage.local.set({onOffTTV: onOff.checked ? 'true' : 'false'});
    chrome.storage.local.set({blockingMessageTTV: blockingMessage.checked ? 'true' : 'false'});
    //chrome.storage.local.set({forcedQualityTTV: forcedQuality.options[forcedQuality.selectedIndex].text});
    chrome.storage.local.set({proxyTTV: proxy.options[proxy.selectedIndex].text});
    chrome.storage.local.set({proxyQualityTTV: proxyQuality.options[proxyQuality.selectedIndex].text});
    chrome.storage.local.set({excludedChannelsTTV: excludedChannels.value.replace(/\r?\n|\r|\s/g, "").split(";")});
}

function restoreOptions() {
    restoreToggle('onOffTTV', onOff);
    restoreToggle('blockingMessageTTV', blockingMessage);
    //restoreDropdown('forcedQualityTTV', forcedQuality);
    restoreDropdown('proxyTTV', proxy);
    restoreDropdown('proxyQualityTTV', proxyQuality);
    restoreAdtime('adTimeTTV', adTime);
    restoreTextArray('excludedChannelsTTV', excludedChannels, ';');
}

function restoreToggle(name, toggle) {
    chrome.storage.local.get([name], function(result) {
        if (result[name]) {
            toggle.checked = result[name] == 'true';
        }
    });
}

function restoreDropdown(name, dropdown) {
    chrome.storage.local.get([name], function(result) {
        if (result[name]) {
            var items = Array.from(dropdown.options).filter(item => item.text == result[name]);
            if (items.length == 1) {
                dropdown.selectedIndex = items[0].index;
            }
        }
    });
}

function restoreAdtime(name, container) {
    chrome.storage.local.get([name], function(result) {
        if (result[name]) {
            // only display hours / minutes if needed
            const hours = Math.trunc(result[name] / 3600);
            const minutes = Math.trunc((result[name] - hours * 3600) / 60);
            container.innerText = `${hours>0 ? hours+"h " : ""}${minutes>0 ? minutes+"min " : ""}${result[name] % 60}s`;
        }
    });
}

function restoreTextArray(name, textArea, separator) {
    chrome.storage.local.get([name], function(result) {
        var loadedArray = result[name];
        if (loadedArray.length !== 0) {
            textArea.value = loadedArray.join(separator);
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);