// Configuration
const API_BASE_URL = 'http://localhost:8080/api/leads';
const CURRENT_DEALER_ID = 'dealer001';

// State
let allLeads = [];

// DOM Elements
const createLeadBtn = document.getElementById('createLeadBtn');
const refreshBtn = document.getElementById('refreshBtn');
const createLeadModal = document.getElementById('createLeadModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const createLeadForm = document.getElementById('createLeadForm');
const leadsTableBody = document.getElementById('leadsTableBody');
const toast = document.getElementById('toast');
const viewLeadModal = document.getElementById('viewLeadModal');
const closeViewModalBtn = document.getElementById('closeViewModalBtn');
const leadDetailsContent = document.getElementById('leadDetailsContent');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadLeads();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    createLeadBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', () => closeModal());
    cancelBtn.addEventListener('click', () => closeModal());
    closeViewModalBtn.addEventListener('click', () => closeViewModal());
    refreshBtn.addEventListener('click', () => loadLeads());
    createLeadForm.addEventListener('submit', handleCreateLead);

    // Close modals on outside click
    createLeadModal.addEventListener('click', (e) => {
        if (e.target === createLeadModal) {
            closeModal();
        }
    });

    viewLeadModal.addEventListener('click', (e) => {
        if (e.target === viewLeadModal) {
            closeViewModal();
        }
    });
}

// Modal Functions
function openModal() {
    createLeadModal.classList.add('show');
    createLeadForm.reset();
}

function closeModal() {
    createLeadModal.classList.remove('show');
}

function openViewModal(leadId) {
    const lead = allLeads.find(l => l.leadId === leadId);
    if (!lead) return;

    const score = calculateLeadScore(lead);
    const scoreClass = getScoreClass(score);

    leadDetailsContent.innerHTML = `
        <!-- Score Section -->
        <div class="detail-section">
            <div class="score-display">
                <div class="score-circle">${score}</div>
                <div class="score-info">
                    <h3>Lead Quality Score</h3>
                    <p>This lead has a ${scoreClass === 'high' ? 'high' : scoreClass === 'medium' ? 'medium' : 'low'} quality score based on multiple factors</p>
                </div>
            </div>
        </div>

        <!-- Personal Information -->
        <div class="detail-section">
            <div class="detail-section-title">
                <span class="detail-section-icon">👤</span>
                Personal Information
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">First Name</div>
                    <div class="detail-value">${lead.firstName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Last Name</div>
                    <div class="detail-value">${lead.lastName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Lead ID</div>
                    <div class="detail-value" style="font-family: monospace; font-size: 12px;">${lead.leadId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">State</div>
                    <div class="detail-value">
                        <span class="badge badge-${lead.state.toLowerCase()}">${lead.state}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Information -->
        <div class="detail-section">
            <div class="detail-section-title">
                <span class="detail-section-icon">📞</span>
                Contact Information
            </div>
            <div class="contact-info">
                ${lead.email ? `
                    <div class="contact-item">
                        <div class="contact-icon">📧</div>
                        <div class="contact-details">
                            <div class="contact-type">Email</div>
                            <div class="contact-value">${lead.email.address}</div>
                        </div>
                    </div>
                ` : ''}
                ${lead.phone ? `
                    <div class="contact-item">
                        <div class="contact-icon">📱</div>
                        <div class="contact-details">
                            <div class="contact-type">Phone</div>
                            <div class="contact-value">${lead.phone.countryCode} ${lead.phone.number}</div>
                        </div>
                    </div>
                ` : ''}
                ${!lead.email && !lead.phone ? `
                    <div class="detail-value empty">No contact information available</div>
                ` : ''}
            </div>
        </div>

        <!-- Lead Source & Tracking -->
        <div class="detail-section">
            <div class="detail-section-title">
                <span class="detail-section-icon">📊</span>
                Lead Source & Tracking
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Source</div>
                    <div class="detail-value">
                        <span class="source-badge source-${lead.source.toLowerCase()}">${formatSource(lead.source)}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Dealer ID</div>
                    <div class="detail-value" style="font-family: monospace;">${lead.dealerId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Tenant ID</div>
                    <div class="detail-value" style="font-family: monospace;">${lead.tenantId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Site ID</div>
                    <div class="detail-value" style="font-family: monospace;">${lead.siteId}</div>
                </div>
            </div>
        </div>

        <!-- Vehicle Interest -->
        <div class="detail-section">
            <div class="detail-section-title">
                <span class="detail-section-icon">🚗</span>
                Vehicle Interest
            </div>
            ${lead.vehicleInterest ? `
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Make</div>
                        <div class="detail-value">${lead.vehicleInterest.make || '—'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Model</div>
                        <div class="detail-value">${lead.vehicleInterest.model || '—'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Year</div>
                        <div class="detail-value">${lead.vehicleInterest.year || '—'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Trade-in Value</div>
                        <div class="detail-value large">${lead.vehicleInterest.tradeInValue ? '$' + lead.vehicleInterest.tradeInValue.toLocaleString() : '—'}</div>
                    </div>
                </div>
            ` : `
                <div class="detail-value empty">No vehicle interest information available</div>
            `}
        </div>

        <!-- Timestamps -->
        <div class="detail-section">
            <div class="detail-section-title">
                <span class="detail-section-icon">🕐</span>
                Timeline
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Created At</div>
                    <div class="detail-value">${formatFullDate(lead.createdAt)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Last Updated</div>
                    <div class="detail-value">${formatFullDate(lead.updatedAt)}</div>
                </div>
            </div>
        </div>
    `;

    viewLeadModal.classList.add('show');
}

function closeViewModal() {
    viewLeadModal.classList.remove('show');
}

// API Functions
async function loadLeads() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/dealer/${CURRENT_DEALER_ID}`);

        if (!response.ok) {
            throw new Error('Failed to fetch leads');
        }

        allLeads = await response.json();
        renderLeads(allLeads);
        updateStats(allLeads);
        showToast('Leads loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading leads:', error);
        showError('Failed to load leads. Make sure the backend is running on port 8080.');
        showEmptyState();
    }
}

async function handleCreateLead(e) {
    e.preventDefault();

    const leadData = {
        dealerId: CURRENT_DEALER_ID,
        tenantId: 'tenant1',
        siteId: 'site1',
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        source: document.getElementById('source').value
    };

    // Add optional fields
    const email = document.getElementById('email').value;
    if (email) {
        leadData.email = { address: email };
    }

    const phone = document.getElementById('phone').value;
    if (phone) {
        leadData.phone = { countryCode: '+1', number: phone };
    }

    // Add vehicle interest if provided
    const vehicleMake = document.getElementById('vehicleMake').value;
    const vehicleModel = document.getElementById('vehicleModel').value;
    const vehicleYear = document.getElementById('vehicleYear').value;
    const tradeInValue = document.getElementById('tradeInValue').value;

    if (vehicleMake || vehicleModel || vehicleYear || tradeInValue) {
        leadData.vehicleInterest = {
            make: vehicleMake || null,
            model: vehicleModel || null,
            year: vehicleYear ? parseInt(vehicleYear) : null,
            tradeInValue: tradeInValue ? parseFloat(tradeInValue) : null
        };
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData)
        });

        if (!response.ok) {
            throw new Error('Failed to create lead');
        }

        const result = await response.json();
        showToast(`Lead created successfully! Score: ${result.score.totalScore.toFixed(1)}`, 'success');
        closeModal();
        loadLeads();
    } catch (error) {
        console.error('Error creating lead:', error);
        showToast('Failed to create lead. Please try again.', 'error');
    }
}

// Render Functions
function renderLeads(leads) {
    if (!leads || leads.length === 0) {
        showEmptyState();
        return;
    }

    leadsTableBody.innerHTML = leads.map(lead => `
        <tr>
            <td>
                <div style="font-weight: 600;">${lead.firstName} ${lead.lastName}</div>
                ${lead.email ? `<div style="font-size: 12px; color: var(--tekion-gray);">${lead.email.address}</div>` : ''}
            </td>
            <td>
                <span class="source-badge source-${lead.source.toLowerCase()}">${formatSource(lead.source)}</span>
            </td>
            <td>
                ${lead.vehicleInterest ? renderVehicleInfo(lead.vehicleInterest) : '<span style="color: var(--tekion-gray);">—</span>'}
            </td>
            <td>
                <span class="badge badge-${lead.state.toLowerCase()}">${lead.state}</span>
            </td>
            <td>
                <span class="score-badge score-${getScoreClass(calculateLeadScore(lead))}">${calculateLeadScore(lead)}</span>
            </td>
            <td>
                <div class="timestamp">
                    <div class="timestamp-date">${formatDate(lead.createdAt)}</div>
                    <div>${formatTime(lead.createdAt)}</div>
                </div>
            </td>
            <td>
                <button class="action-btn" onclick="viewLeadDetails('${lead.leadId}')">View</button>
            </td>
        </tr>
    `).join('');
}

function renderVehicleInfo(vehicle) {
    if (!vehicle) return '—';

    const parts = [];
    if (vehicle.year) parts.push(vehicle.year);
    if (vehicle.make) parts.push(vehicle.make);
    if (vehicle.model) parts.push(vehicle.model);

    const vehicleName = parts.join(' ') || 'Vehicle';
    const tradeIn = vehicle.tradeInValue ? `Trade-in: $${vehicle.tradeInValue.toLocaleString()}` : '';

    return `
        <div class="vehicle-info">
            <div class="vehicle-name">${vehicleName}</div>
            ${tradeIn ? `<div class="vehicle-details">${tradeIn}</div>` : ''}
        </div>
    `;
}

function showEmptyState() {
    leadsTableBody.innerHTML = `
        <tr>
            <td colspan="7">
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-title">No leads found</div>
                    <div class="empty-state-text">Create your first lead to get started</div>
                </div>
            </td>
        </tr>
    `;
}

function showLoading() {
    leadsTableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="7" class="loading-cell">
                <div class="loader"></div>
                <span>Loading leads...</span>
            </td>
        </tr>
    `;
}

function showError(message) {
    leadsTableBody.innerHTML = `
        <tr>
            <td colspan="7">
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-title">Error Loading Leads</div>
                    <div class="empty-state-text">${message}</div>
                </div>
            </td>
        </tr>
    `;
}

// Stats Functions
function updateStats(leads) {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.state === 'NEW').length;
    const avgScore = totalLeads > 0
        ? (leads.reduce((sum, lead) => sum + calculateLeadScore(lead), 0) / totalLeads).toFixed(1)
        : 0;

    document.getElementById('totalLeads').textContent = totalLeads;
    document.getElementById('newLeads').textContent = newLeads;
    document.getElementById('avgScore').textContent = avgScore;
}

// Utility Functions
function calculateLeadScore(lead) {
    // Simple scoring algorithm based on available data
    let score = 50; // Base score

    // Source quality
    const sourceScores = {
        'REFERRAL': 20,
        'WEBSITE': 15,
        'PHONE': 10,
        'WALKIN': 5
    };
    score += sourceScores[lead.source] || 0;

    // Vehicle interest
    if (lead.vehicleInterest) {
        score += 10;
        if (lead.vehicleInterest.tradeInValue > 10000) score += 10;
        if (lead.vehicleInterest.year >= 2018) score += 5;
    }

    // Contact info
    if (lead.email) score += 5;
    if (lead.phone) score += 5;

    // Recency (newer leads get higher scores)
    const hoursSinceCreation = (new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60);
    if (hoursSinceCreation < 24) score += 10;
    else if (hoursSinceCreation < 72) score += 5;

    return Math.min(100, Math.round(score));
}

function getScoreClass(score) {
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

function formatSource(source) {
    const sourceMap = {
        'WEBSITE': 'Website',
        'PHONE': 'Phone',
        'WALKIN': 'Walk-in',
        'REFERRAL': 'Referral'
    };
    return sourceMap[source] || source;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function viewLeadDetails(leadId) {
    openViewModal(leadId);
}

function formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

