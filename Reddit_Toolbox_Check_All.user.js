// ==UserScript==
// @name        Reddit Moderator Toolbox Check All
// @namespace   redditmoderatortoolboxcheckall
// @include     *://*.reddit.com/*
// @version     1.1
// @downloadURL  https://github.com/quentinwolf/TamperMonkeyScripts/raw/main/Reddit_Toolbox_Check_All.user.js
// @updateURL    https://github.com/quentinwolf/TamperMonkeyScripts/raw/main/Reddit_Toolbox_Check_All.user.js
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // Button configurations
    const buttonConfigs = [
        {
            name: "Impersonation",
            banNote: "Malicious Impersonation Bot",
            banMessage: "Impersonation isn't allowed here or anywhere.",
            checkAll: true
        },
        {
            name: "Spam",
            banNote: "Spambot",
            banMessage: "Spam isn't welcome here or anywhere.",
            checkAll: false
        }
    ];

    // Function that adds the "Check all" button and its click event
    function addCheckAllButton() {
        if ($('#check-all-button').length === 0) {
            // Add the "Check all" button
            $('.ban-note-container').before('<button id="check-all-button" type="button">Check All</button>');

            // Track the state of the button
            let allChecked = false;

            // When the "Check all" button is clicked
            $('#check-all-button').click(function() {
                // If all checkboxes are already checked, uncheck them
                if (allChecked) {
                    $('.action-sub').each(function() {
                        if (!$(this).hasClass('other-sub-checkbox')) {
                            $(this).prop('checked', false);
                        }
                    });
                    $(this).text('Check All');
                    allChecked = false;
                }
                // Otherwise, check all checkboxes in the "ban" section, except for those with specific class
                else {
                    $('.action-sub').each(function() {
                        if (!$(this).hasClass('other-sub-checkbox')) {
                            $(this).prop('checked', true);
                        }
                    });
                    $(this).text('Uncheck All');
                    allChecked = true;
                }
            });

            // Add the buttons based on the configurations
            for (let i = 0; i < buttonConfigs.length; i++) {
                let config = buttonConfigs[i];
                let buttonId = 'config-button-' + i;

                // Add the button
                $('.ban-note-container').before(' <button id="' + buttonId + '" type="button">' + config.name + '</button>');

                // When the button is clicked
                $('#' + buttonId).click(function() {
                    // If the checkAll property of the button configuration is true
                    if (config.checkAll) {
                        // Check all checkboxes in the "ban" section, except for those with specific class
                        $('.action-sub').each(function() {
                            if (!$(this).hasClass('other-sub-checkbox')) {
                                $(this).prop('checked', true);
                            }
                        });
                        $('#check-all-button').text('Uncheck All');
                        allChecked = true;
                    }

                    // Fill the ban note and ban message fields
                    $('#ban-note').val(config.banNote);
                    $('.ban-message').val(config.banMessage);

                    // Change dropdown to "ban" option
                    $('.mod-action.tb-action-button option[data-api="friend"][data-action="banned"]').prop('selected', true);
                });
            }
        }
    }

    // Create a MutationObserver instance to watch for changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        // If there are mutations
        if (mutations) {
            // Set a timeout to ensure all elements are fully loaded
            setTimeout(addCheckAllButton, 2000);
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
})();
