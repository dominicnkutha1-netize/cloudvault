// CloudVault - Notes app with Supabase
let supabase = null;
let currentNoteId = null;
let notes = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved config
    const savedUrl = localStorage.getItem('supabaseUrl');
    const savedKey = localStorage.getItem('supabaseKey');
    
    if (savedUrl && savedKey) {
        try {
            supabase = window.supabase.createClient(savedUrl, savedKey);
            document.getElementById('configModal').classList.remove('modal--active');
            loadNotes();
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            showToast('Error connecting to Supabase');
        }
    }
    
    // Event Listeners
    document.getElementById('addNoteBtn').addEventListener('click', () => openModal());
    document.getElementById('emptyAddBtn').addEventListener('click', () => openModal());
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalBackdrop').addEventListener('click', closeModal);
    document.getElementById('modalSave').addEventListener('click', saveNote);
    document.getElementById('configSave').addEventListener('click', saveConfig);
    document.getElementById('searchInput').addEventListener('input', filterNotes);
    
    // Enter key in modal
    document.getElementById('noteTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            saveNote();
        }
    });
});

function saveConfig() {
    const url = document.getElementById('supabaseUrl').value.trim();
    const key = document.getElementById('supabaseKey').value.trim();
    
    if (!url || !key) {
        showToast('Please enter both URL and key');
        return;
    }
    
    try {
        supabase = window.supabase.createClient(url, key);
        localStorage.setItem('supabaseUrl', url);
        localStorage.setItem('supabaseKey', key);
        document.getElementById('configModal').classList.remove('modal--active');
        showToast('Connected successfully!');
        loadNotes();
    } catch (error) {
        console.error('Error:', error);
        showToast('Invalid credentials');
    }
}

function openModal(note = null) {
    currentNoteId = note ? note.id : null;
    document.getElementById('modalTitle').textContent = note ? 'Edit Note' : 'New Note';
    document.getElementById('noteTitle').value = note ? note.title : '';
    document.getElementById('noteContent').value = note ? note.content : '';
    document.getElementById('noteModal').classList.add('modal--active');
    document.getElementById('noteTitle').focus();
}

function closeModal() {
    document.getElementById('noteModal').classList.remove('modal--active');
    currentNoteId = null;
}

async function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title) {
        showToast('Please enter a title');
        document.getElementById('noteTitle').focus();
        return;
    }
    
    try {
        if (currentNoteId) {
            // Update existing note
            const { error } = await supabase
                .from('notes')
                .update({ title, content, updated_at: new Date().toISOString() })
                .eq('id', currentNoteId);
            
            if (error) throw error;
            showToast('Note updated!');
        } else {
            // Create new note
            const { error } = await supabase
                .from('notes')
                .insert([{ title, content }]);
            
            if (error) throw error;
            showToast('Note created!');
        }
        
        closeModal();
        loadNotes();
    } catch (error) {
        console.error('Error saving note:', error);
        showToast('Error saving note');
    }
}

async function loadNotes() {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        notes = data || [];
        renderNotes();
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Error loading notes');
    }
}

function renderNotes(filter = '') {
    const grid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('emptyState');
    const count = document.getElementById('notesCount');
    
    let filteredNotes = notes;
    if (filter) {
        const searchTerm = filter.toLowerCase();
        filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );
    }
    
    count.textContent = `${filteredNotes.length} note${filteredNotes.length !== 1 ? 's' : ''}`;
    
    if (filteredNotes.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.add('empty-state--active');
        return;
    }
    
    emptyState.classList.remove('empty-state--active');
    grid.innerHTML = '';
    
    filteredNotes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <h3 class="note-card__title">${escapeHtml(note.title)}</h3>
            <p class="note-card__content">${escapeHtml(note.content)}</p>
            <div class="note-card__footer">
                <span class="note-card__date">${formatDate(note.created_at)}</span>
                <button class="note-card__delete" data-id="${note.id}" title="Delete">
                    <i class="ti ti-trash"></i>
                </button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.note-card__delete')) {
                return;
            }
            openModal(note);
        });
        
        card.querySelector('.note-card__delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });
        
        grid.appendChild(card);
    });
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showToast('Note deleted');
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Error deleting note');
    }
}

function filterNotes() {
    const searchTerm = document.getElementById('searchInput').value;
    renderNotes(searchTerm);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('toast--show');
    setTimeout(() => {
        toast.classList.remove('toast--show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
