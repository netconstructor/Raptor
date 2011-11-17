(function($) {
    
    var spacer = $('<div class="ui-widget-editor-dock-spacer"/>').hide();
    
    $(function() {
        spacer.prependTo('body');
    })
    
    $.ui.editor.addPlugin('dock', function(editor, options) {
        var plugin = this;
        var persist = editor.persist('dock') || { docked: false };
        
        this.dock = function() {
            persist.docked = true;
            editor.persist('dock', persist);
            this.dialog().addClass('ui-widget-editor-docked');
            this.toolbar().addClass('ui-widget-header');
            this.button().button({ icons: { primary: 'ui-icon-pin-w' } });
            if (editor.options.customTooltips) {
                this.button().tipTip({
                    content: _('Click to detach the toolbar')
                });
            }
            spacer.height(this.toolbar().outerHeight()).show();
            editor.trigger('resize');
        }
        
        this.undock = function() {
            persist.docked = false;
            editor.persist('dock', persist);
            this.dialog().removeClass('ui-widget-editor-docked');
            this.dialog().find('.ui-widget-editor-inner:first').removeClass('ui-widget-header');
            this.button().button({ icons: { primary: 'ui-icon-pin-s' } });
            if (editor.options.customTooltips) {
                this.button().tipTip({
                    content: _('Click to dock the toolbar')
                });
            }
            spacer.hide();
            editor.trigger('resize');
        }
        
        this.isDocked = function() {
            return persist.docked;
        }
        
        this.dialog = function() {
            return editor.selDialog();
        }
        
        this.toolbar = function() {
            return this.dialog().find('.ui-widget-editor-inner:first');
        }
        
        this.button = function() {
            return this.dialog().find('.ui-widget-editor-button-dock');
        }
        
        this.destroy = function() {
            var spacer = $('.ui-widget-editor-dock-spacer');
            if (spacer.length) spacer.hide('fast');
            delete editor;
        }
        
        editor.bind('enabled', function() {
            if (persist.docked || options.docked) {
                plugin.dock();
            } 
        });
        
        editor.bind('disabled', function() {
            spacer.hide();
        });
    });
    
    $.ui.editor.registerUi({
        dock: function(editor) {
            this.ui = editor.uiButton({
                name: 'dock',
                title: _('Click to dock the toolbar'),
                icons: {
                    primary: editor.getPlugin('dock').isDocked() ? 'ui-icon-pin-w' : 'ui-icon-pin-s'
                },
                click: function() {
                    var plugin = editor.getPlugin('dock');
                    if (plugin.isDocked()) plugin.undock();
                    else plugin.dock();
                }
            });
        }
    });
    
})(jQuery);
