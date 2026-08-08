---
title: Learning Graph Viewer
description: Interactive vis-network explorer for all 256 Semiconductor Physics concepts, with search, category filtering, and links into chapters, glossary, quizzes, and MicroSims
---

# Learning Graph Viewer

[Open Learning Graph Viewer](./main.html){ .md-button .md-button--primary }

<iframe src="./main.html" width="100%" height="650px" scrolling="no"></iframe>

Template for iframe

```yml
<iframe src="./main.html" width="100%" height="650px" scrolling="no"></iframe>
```

This interactive viewer lets you explore all 256 concepts in the Semiconductor Physics learning graph. It is the visual map of the entire course: every concept links back to the chapter and glossary entry that teaches it, the concepts it depends on, the concepts that depend on it, and any related MicroSims.

## Features

- **Search**: Type in the search box to find and highlight specific concepts, then click a result to focus on it
- **Category Filtering**: Use checkboxes to show/hide the 14 concept categories, or Check All / Uncheck All
- **Node Detail Panel**: Click any concept to see its definition, chapter, prerequisites, dependents, Bloom level (where available), related MicroSims, and links to the glossary, quiz, and practice problems
- **Prerequisite/Dependent Highlighting**: Selecting a concept highlights its prerequisites (blue edges) and the concepts that depend on it (orange edges), and dims everything else
- **Reset View / Fit to Screen**: Toolbar buttons to clear the current selection or re-center the graph
- **Statistics**: Live counts of visible nodes, visible edges, total concepts, and foundational concepts
- **Collapsible Sidebar**: Automatically collapses on small screens; toggle with the &#9776; button

## Using the Viewer

1. **Search for Concepts**: Start typing in the search box to find and highlight concepts. Click a result to focus on that node.
2. **Filter by Category**: Use the category checkboxes in the sidebar to show or hide groups of related concepts.
3. **Explore a Concept**: Click on a node to open its detail panel, then click any prerequisite or dependent chip to jump directly to that concept.
4. **Navigate the Graph**: Drag to pan, scroll to zoom, use Fit to Screen to re-center, or Reset View to clear the current selection.
5. **Jump into the Textbook**: From the detail panel, follow the links to the concept's chapter, glossary entry, chapter quiz, or practice problems.

## Graph Structure

- **Foundational Concepts** (left side): Prerequisites with no dependencies of their own
- **Advanced Concepts** (right side): Topics that build on multiple prerequisites
- **Edges**: Arrows point from a concept to the prerequisites it depends on
