import searchNotesService from '../services/search_notes.js';
import noteAutocompleteService from '../services/note_autocomplete.js';
import utils from "../services/utils.js";
import appContext from "../services/app_context.js";

const $dialog = $("#jump-to-note-dialog");
const $autoComplete = $("#jump-to-note-autocomplete");
const $showInFullTextButton = $("#show-in-full-text-button");

export async function showDialog() {
    utils.closeActiveDialog();

    glob.activeDialog = $dialog;

    $autoComplete.val('');

    $dialog.modal();

    noteAutocompleteService.initNoteAutocomplete($autoComplete, { hideGoToSelectedNoteButton: true })
        .on('autocomplete:selected', function(event, suggestion, dataset) {
            if (!suggestion.path) {
                return false;
            }

            appContext.getActiveTabContext().setNote(suggestion.path);
        });

    noteAutocompleteService.showRecentNotes($autoComplete);
}

function showInFullText(e) {
    // stop from propagating upwards (dangerous especially with ctrl+enter executable javascript notes)
    e.preventDefault();
    e.stopPropagation();

    const searchText = $autoComplete.val();

    searchNotesService.resetSearch();
    searchNotesService.showSearch();
    searchNotesService.doSearch(searchText);

    $dialog.modal('hide');
}


$showInFullTextButton.on('click', showInFullText);

utils.bindElShortcut($dialog, 'ctrl+return', showInFullText);
