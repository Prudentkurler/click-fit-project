import { initJqueryInteractions } from "./jquery-interactions.js";
import { initPlugins } from "./plugins.js";

const $ = window.jQuery;
$(function(){
    initJqueryInteractions();
    initPlugins();

})