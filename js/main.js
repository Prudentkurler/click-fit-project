import { initJqueryInteractions } from "./jquery-interactions.js";
import { initPlugins } from "./plugins.js";
import { initFeed } from "./feeds.js";


const $ = window.jQuery;
$(function(){
    initJqueryInteractions();
    initPlugins();
    initFeed();


})