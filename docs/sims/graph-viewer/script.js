// Learning Graph Viewer Script for Semiconductor Physics
// Loads and displays an interactive learning graph using vis-network.
// Architecture follows the Circuits 1 graph-viewer (sidebar + search + category
// filtering + stats), extended with a node detail panel, prerequisite/dependent
// highlighting, and Reset View / Fit to Screen controls.

let network = null;
let allNodes = [];
let allEdges = [];
let groups = {};
let visibleGroups = new Set();
let conceptMeta = {};       // id (string) -> enriched concept metadata
let selectedNodeId = null;

const PREREQ_EDGE_COLOR = '#2196F3';   // blue: edges toward prerequisites
const DEPENDENT_EDGE_COLOR = '#FF9800'; // orange: edges from dependents
const DEFAULT_EDGE_COLOR = '#888';

// Load the learning graph data and the enriched concept metadata
async function loadGraph() {
    try {
        const [graphResponse, metaResponse] = await Promise.all([
            fetch('../../learning-graph/learning-graph.json'),
            fetch('../../learning-graph/concept-metadata.json')
        ]);
        const data = await graphResponse.json();
        const meta = await metaResponse.json();

        allNodes = data.nodes || [];
        allEdges = data.edges || [];
        groups = data.groups || {};
        conceptMeta = meta.concepts || {};

        // Initialize all groups as visible
        Object.keys(groups).forEach(g => visibleGroups.add(g));

        initializeNetwork();
        buildLegend();
        updateStats();
        setupSearch();
        setupControls();

    } catch (error) {
        console.error('Error loading learning graph:', error);
        document.getElementById('network').innerHTML =
            '<p style="color: red; padding: 20px;">Error loading learning graph. Make sure learning-graph.json and concept-metadata.json exist.</p>';
    }
}

// Initialize the vis-network visualization
function initializeNetwork() {
    const container = document.getElementById('network');

    // Create nodes DataSet - colors are handled by the groups option
    const nodes = new vis.DataSet(allNodes);

    // Create edges DataSet. Edge direction is from -> to meaning
    // "from" depends on (requires) "to", matching learning-graph.json convention.
    const edges = new vis.DataSet(allEdges.map((edge, i) => ({
        id: edge.id || `${edge.from}-${edge.to}`,
        from: edge.from,
        to: edge.to,
        arrows: 'to',
        color: { color: DEFAULT_EDGE_COLOR, opacity: 0.6 }
    })));

    const data = { nodes, edges };

    // Build vis-network groups configuration from JSON groups
    const visGroups = {};
    Object.entries(groups).forEach(([groupId, groupInfo]) => {
        visGroups[groupId] = {
            color: {
                background: groupInfo.color || 'lightgray',
                border: groupInfo.color || 'lightgray',
                highlight: {
                    background: groupInfo.color || 'lightgray',
                    border: '#333'
                },
                hover: {
                    background: groupInfo.color || 'lightgray',
                    border: '#666'
                }
            },
            font: {
                color: groupInfo.font?.color || 'black'
            }
        };
    });

    const options = {
        groups: visGroups,
        layout: {
            randomSeed: 42,
            improvedLayout: true
        },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -60,
                centralGravity: 0.01,
                springLength: 100,
                springConstant: 0.08,
                damping: 0.4,
                avoidOverlap: 0.5
            },
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 25
            }
        },
        nodes: {
            shape: 'box',
            margin: 4,
            font: {
                size: 13,
                face: 'Arial'
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'horizontal',
                roundness: 0.4
            },
            width: 1.5
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            zoomView: true,
            dragView: true
        }
    };

    network = new vis.Network(container, data, options);

    // Stop physics after stabilization to prevent endless spinning, then fit view
    network.once('stabilizationIterationsDone', function() {
        network.setOptions({ physics: { enabled: false } });
        network.fit({ animation: false });
    });
    setTimeout(() => {
        network.setOptions({ physics: { enabled: false } });
    }, 6000);

    // Re-enable physics when dragging a node, disable when done
    network.on('dragStart', function(params) {
        if (params.nodes.length > 0) {
            network.setOptions({ physics: { enabled: true } });
        }
    });

    network.on('dragEnd', function(params) {
        if (params.nodes.length > 0) {
            setTimeout(() => {
                network.setOptions({ physics: { enabled: false } });
            }, 1000);
        }
    });

    // Single click handler drives both node selection and empty-canvas
    // deselection, avoiding any dependence on selectNode/deselectNode event order.
    network.on('click', function(params) {
        if (params.nodes.length > 0) {
            selectNode(params.nodes[0]);
        } else {
            clearSelection();
        }
    });

    // Subtle hover emphasis (border only) that doesn't fight click-selection
    network.on('hoverNode', function(params) {
        if (params.node !== selectedNodeId) {
            network.body.data.nodes.update({ id: params.node, borderWidth: 4 });
        }
    });
    network.on('blurNode', function(params) {
        if (params.node !== selectedNodeId) {
            network.body.data.nodes.update({ id: params.node, borderWidth: 2 });
        }
    });

    // Tooltip title (native vis-network hover tooltip) with category + definition
    allNodes.forEach(node => {
        const meta = conceptMeta[node.id];
        const groupInfo = groups[node.group] || {};
        const title = meta
            ? `${node.label} (${groupInfo.classifierName || node.group})\n${meta.definition || ''}`
            : node.label;
        nodes.update({ id: node.id, title });
    });
}

// Build the category legend, preserving the order categories appear in the
// learning-graph JSON (already curriculum-ordered from foundations to advanced).
function buildLegend() {
    const legendContainer = document.getElementById('legend');
    legendContainer.innerHTML = '';

    Object.entries(groups).forEach(([groupId, groupInfo]) => {
        const count = allNodes.filter(n => n.group === groupId).length;

        const item = document.createElement('div');
        item.className = 'legend-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `group-${groupId}`;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => toggleGroup(groupId, checkbox.checked));

        const colorBox = document.createElement('span');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = groupInfo.color || 'lightgray';

        const label = document.createElement('label');
        label.htmlFor = `group-${groupId}`;
        label.textContent = `${groupInfo.classifierName || groupId} (${count})`;

        item.appendChild(checkbox);
        item.appendChild(colorBox);
        item.appendChild(label);
        legendContainer.appendChild(item);
    });
}

// Toggle visibility of a category group
function toggleGroup(groupId, visible) {
    if (visible) {
        visibleGroups.add(groupId);
    } else {
        visibleGroups.delete(groupId);
    }
    updateVisibility();
}

// Update node and edge visibility based on selected groups
function updateVisibility() {
    const visibleNodeIds = new Set(
        allNodes.filter(n => visibleGroups.has(n.group)).map(n => n.id)
    );

    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    allNodes.forEach(node => {
        const isVisible = visibleGroups.has(node.group);
        nodes.update({ id: node.id, hidden: !isVisible });
    });

    allEdges.forEach(edge => {
        const isVisible = visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to);
        edges.update({ id: edge.id || `${edge.from}-${edge.to}`, hidden: !isVisible });
    });

    // If the selected node was just hidden, clear the detail panel/highlight
    if (selectedNodeId !== null && !visibleNodeIds.has(selectedNodeId)) {
        clearSelection();
    }

    updateStats();
}

// Update statistics display
function updateStats() {
    const visibleNodeIds = new Set(
        allNodes.filter(n => visibleGroups.has(n.group)).map(n => n.id)
    );

    const visibleEdgeCount = allEdges.filter(
        e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)
    ).length;

    // Foundational nodes: concepts with no prerequisites of their own (no outgoing edges)
    const nodesWithDeps = new Set(allEdges.map(e => e.from));
    const foundationalCount = allNodes.filter(
        n => !nodesWithDeps.has(n.id) && visibleGroups.has(n.group)
    ).length;

    document.getElementById('visible-nodes').textContent = visibleNodeIds.size;
    document.getElementById('visible-edges').textContent = visibleEdgeCount;
    document.getElementById('total-nodes').textContent = allNodes.length;
    document.getElementById('foundational-nodes').textContent = foundationalCount;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search');
    const resultsContainer = document.getElementById('search-results');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            clearSearchHighlight();
            return;
        }

        const matches = allNodes.filter(n =>
            n.label.toLowerCase().includes(query)
        );

        applySearchHighlight(matches.map(n => n.id));

        const shown = matches.slice(0, 10);
        if (shown.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        shown.forEach(node => {
            const item = document.createElement('div');
            item.className = 'search-result-item';

            const groupInfo = groups[node.group] || {};
            item.innerHTML = `
                <span class="result-label">${node.label}</span>
                <span class="result-category" style="background-color: ${groupInfo.color || 'lightgray'}">
                    ${groupInfo.classifierName || node.group}
                </span>
            `;

            item.addEventListener('click', () => {
                searchInput.value = node.label;
                resultsContainer.style.display = 'none';
                clearSearchHighlight();
                focusNode(node.id);
            });

            resultsContainer.appendChild(item);
        });

        resultsContainer.style.display = 'block';
    });

    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

// Highlight all nodes matching the current search query (dim the rest)
function applySearchHighlight(matchIds) {
    if (selectedNodeId !== null) return; // don't fight an active node selection
    const matchSet = new Set(matchIds);
    const nodes = network.body.data.nodes;
    allNodes.forEach(node => {
        nodes.update({
            id: node.id,
            opacity: matchSet.has(node.id) ? 1 : 0.2,
            borderWidth: matchSet.has(node.id) ? 4 : 2
        });
    });
}

function clearSearchHighlight() {
    if (selectedNodeId !== null) return;
    const nodes = network.body.data.nodes;
    allNodes.forEach(node => {
        nodes.update({ id: node.id, opacity: 1, borderWidth: 2 });
    });
}

// Focus the camera on a node and select it
function focusNode(nodeId) {
    network.focus(nodeId, {
        scale: 1.2,
        animation: { duration: 500, easingFunction: 'easeInOutQuad' }
    });
    network.selectNodes([nodeId]);
    selectNode(nodeId);
}

// Select a node: persistently emphasize it plus its prerequisites (blue) and
// dependents (orange), de-emphasize everything else, and show the detail panel.
function selectNode(nodeId) {
    selectedNodeId = nodeId;
    clearSearchHighlight();

    const meta = conceptMeta[nodeId];
    const prereqIds = new Set(meta ? meta.prerequisites : []);
    const dependentIds = new Set(meta ? meta.dependents : []);
    const relatedIds = new Set([nodeId, ...prereqIds, ...dependentIds]);

    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    allNodes.forEach(node => {
        nodes.update({
            id: node.id,
            opacity: relatedIds.has(node.id) ? 1 : 0.15,
            borderWidth: node.id === nodeId ? 4 : 2
        });
    });

    allEdges.forEach(edge => {
        const edgeId = edge.id || `${edge.from}-${edge.to}`;
        if (edge.from === nodeId) {
            // this concept depends on edge.to -> prerequisite direction
            edges.update({ id: edgeId, color: { color: PREREQ_EDGE_COLOR, opacity: 1 }, width: 3 });
        } else if (edge.to === nodeId) {
            // edge.from depends on this concept -> dependent direction
            edges.update({ id: edgeId, color: { color: DEPENDENT_EDGE_COLOR, opacity: 1 }, width: 3 });
        } else {
            edges.update({ id: edgeId, color: { color: DEFAULT_EDGE_COLOR, opacity: 0.08 }, width: 1 });
        }
    });

    showNodeDetail(nodeId);
}

// Clear selection highlighting and hide the detail panel
function clearSelection() {
    selectedNodeId = null;
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    allNodes.forEach(node => {
        nodes.update({ id: node.id, opacity: 1, borderWidth: 2 });
    });
    allEdges.forEach(edge => {
        const edgeId = edge.id || `${edge.from}-${edge.to}`;
        edges.update({ id: edgeId, color: { color: DEFAULT_EDGE_COLOR, opacity: 0.6 }, width: 1.5 });
    });

    hideNodeDetail();
}

// Populate and show the floating node detail panel
function showNodeDetail(nodeId) {
    const meta = conceptMeta[nodeId];
    const panel = document.getElementById('node-detail-panel');
    const content = document.getElementById('node-detail-content');

    if (!meta) {
        content.innerHTML = '<p>No details available for this concept.</p>';
        panel.classList.add('visible');
        return;
    }

    const groupInfo = groups[meta.group] || {};
    const labelById = id => (allNodes.find(n => n.id === id) || {}).label || `#${id}`;

    const renderChipList = (ids, emptyText) => {
        if (!ids || ids.length === 0) {
            return `<span class="chip empty">${emptyText}</span>`;
        }
        return ids.map(id =>
            `<span class="chip" data-node-id="${id}">${labelById(id)}</span>`
        ).join('');
    };

    const renderSimList = (slugs) => {
        if (!slugs || slugs.length === 0) {
            return '<span class="chip empty">None linked</span>';
        }
        return slugs.map(slug =>
            `<a class="chip" href="../${slug}/">${slug.replace(/-/g, ' ')}</a>`
        ).join('');
    };

    content.innerHTML = `
        <h3>${meta.label}</h3>
        <span class="detail-category-badge" style="background-color: ${groupInfo.color || '#eee'}; color: ${groupInfo.font?.color || '#333'}">
            ${meta.category}
        </span>
        ${meta.bloom ? `<span class="bloom-badge">Bloom: ${meta.bloom}</span>` : ''}
        <p class="detail-definition">${meta.definition || 'No definition available.'}</p>

        <div class="detail-section">
            <h4>Prerequisite Concepts</h4>
            <div class="chip-list" id="prereq-chips">${renderChipList(meta.prerequisites, 'None — foundational concept')}</div>
        </div>

        <div class="detail-section">
            <h4>Concepts That Depend On This</h4>
            <div class="chip-list" id="dependent-chips">${renderChipList(meta.dependents, 'None yet')}</div>
        </div>

        <div class="detail-section">
            <h4>Related MicroSims</h4>
            <div class="chip-list">${renderSimList(meta.microsims)}</div>
        </div>

        <div class="detail-links">
            <a href="${meta.chapterUrl}">&#8594; Chapter ${meta.chapter}: ${meta.chapterTitle}</a>
            <a href="${meta.glossaryUrl}">&#8594; Glossary Definition</a>
            <a href="${meta.quizUrl}">&#8594; Chapter Quiz</a>
            <a href="${meta.problemsUrl}">&#8594; Practice Problems</a>
        </div>
    `;

    // Clicking a prerequisite/dependent chip jumps to that concept
    content.querySelectorAll('.chip[data-node-id]').forEach(chip => {
        chip.addEventListener('click', () => {
            const targetId = parseInt(chip.getAttribute('data-node-id'), 10);
            if (!visibleGroups.has((allNodes.find(n => n.id === targetId) || {}).group)) return;
            focusNode(targetId);
        });
    });

    panel.classList.add('visible');
}

function hideNodeDetail() {
    document.getElementById('node-detail-panel').classList.remove('visible');
}

// Setup control buttons
function setupControls() {
    // Toggle sidebar (collapsible on small screens)
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('sidebar-content');
        sidebar.classList.toggle('collapsed');
        content.style.display = sidebar.classList.contains('collapsed') ? 'none' : 'block';
    });

    // Auto-collapse sidebar by default on small screens
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('collapsed');
        document.getElementById('sidebar-content').style.display = 'none';
    }

    // Check all groups
    document.getElementById('check-all').addEventListener('click', function() {
        Object.keys(groups).forEach(groupId => {
            visibleGroups.add(groupId);
            document.getElementById(`group-${groupId}`).checked = true;
        });
        updateVisibility();
    });

    // Uncheck all groups
    document.getElementById('uncheck-all').addEventListener('click', function() {
        Object.keys(groups).forEach(groupId => {
            visibleGroups.delete(groupId);
            document.getElementById(`group-${groupId}`).checked = false;
        });
        updateVisibility();
    });

    // Fit graph to screen without disturbing selection
    document.getElementById('fit-view').addEventListener('click', function() {
        network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
    });

    // Reset view: clear selection/search highlighting and fit to screen
    document.getElementById('reset-view').addEventListener('click', function() {
        network.unselectAll();
        clearSelection();
        document.getElementById('search').value = '';
        document.getElementById('search-results').style.display = 'none';
        clearSearchHighlight();
        network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
    });

    // Close detail panel
    document.getElementById('close-detail').addEventListener('click', function() {
        network.unselectAll();
        clearSelection();
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', loadGraph);
