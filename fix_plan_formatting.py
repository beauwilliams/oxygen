#!/usr/bin/env python3
"""Fix formatting issues in the plan file."""

import re

file_path = '.cursor/plans/oxygen_specification_management_system_-_complete_implementation_plan_0ce2ff8b.plan.md'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find all frontmatter boundaries
frontmatter_boundaries = []
for i, line in enumerate(lines):
    if line.strip() == '---':
        frontmatter_boundaries.append(i)

# We should have exactly 2 boundaries for a single frontmatter block
# But we might have duplicates. Let's find the content start
content_start = -1
for i, line in enumerate(lines):
    if line.strip().startswith('# '):
        content_start = i
        break

# Build new file
new_lines = []

# Add proper frontmatter
new_lines.append('---\n')
new_lines.append('name: Oxygen Specification Management System - Complete Implementation Plan\n')
new_lines.append('overview: Build a comprehensive actor-agnostic specification management system that treats specs as first-class, versioned assets, enabling zero-ambiguity implementations through structured schemas, impact/effort/risk analysis, refinement loops, and strategic roadmap planning. The system uses a PNPM monorepo with TypeScript, targeting Node 22.\n')
new_lines.append('todos:\n')

# Parse todos from the old content (between first --- and content_start)
todos = []
i = 0
while i < len(lines) and i < content_start:
    line = lines[i]
    stripped = line.strip()
    
    # Look for todo items
    if stripped.startswith('- id:'):
        todo_id = stripped.replace('- id:', '').strip()
        # Look ahead for content and status
        content = ''
        status = 'pending'
        j = i + 1
        while j < len(lines) and j < content_start:
            next_line = lines[j].strip()
            if next_line.startswith('content:'):
                content = next_line.replace('content:', '').strip().strip('"')
            elif next_line.startswith('status:'):
                status = next_line.replace('status:', '').strip()
                break
            elif next_line.startswith('- id:'):
                break
            j += 1
        todos.append({'id': todo_id, 'content': content, 'status': status})
    i += 1

# If we didn't find todos in the expected format, try alternative parsing
if not todos:
    # Look for the pattern with excessive spaces
    i = 0
    while i < len(lines) and i < content_start:
        line = lines[i]
        stripped = line.strip()
        if 'id: phase' in stripped:
            # Extract id
            match = re.search(r'id:\s*(phase\d+-\w+)', stripped)
            if match:
                todo_id = match.group(1)
                # Look ahead
                content = ''
                status = 'pending'
                j = i + 1
                while j < len(lines) and j < content_start:
                    next_line = lines[j].strip()
                    if 'content:' in next_line:
                        content_match = re.search(r'content:\s*"([^"]+)"', next_line)
                        if content_match:
                            content = content_match.group(1)
                    elif 'status:' in next_line:
                        status_match = re.search(r'status:\s*(\w+)', next_line)
                        if status_match:
                            status = status_match.group(1)
                            break
                    elif 'id: phase' in next_line:
                        break
                    j += 1
                todos.append({'id': todo_id, 'content': content, 'status': status})
        i += 1

# Add todos with proper YAML formatting
for todo in todos:
    new_lines.append(f"  - id: {todo['id']}\n")
    new_lines.append(f"    content: \"{todo['content']}\"\n")
    new_lines.append(f"    status: {todo['status']}\n")

new_lines.append('---\n')
new_lines.append('\n')

# Add content starting from the first heading
if content_start > 0:
    new_lines.extend(lines[content_start:])

# Now fix indentation in the content
final_lines = []
in_code_block = False

for line in new_lines:
    # Track code blocks
    if line.strip().startswith('```'):
        in_code_block = not in_code_block
        final_lines.append(line)
        continue
    
    # Preserve code blocks
    if in_code_block:
        final_lines.append(line)
        continue
    
    # Skip empty lines
    if not line.strip():
        final_lines.append(line)
        continue
    
    stripped = line.strip()
    leading_spaces = len(line) - len(line.lstrip())
    
    # Headings - no indentation
    if stripped.startswith('#'):
        final_lines.append(stripped + '\n' if not line.endswith('\n') else stripped)
        continue
    
    # Fix excessive indentation (more than 6 spaces)
    if leading_spaces > 6:
        # Determine proper indentation based on context
        base_indent = 0
        
        for j in range(len(final_lines) - 1, -1, -1):
            prev_line = final_lines[j]
            if not prev_line.strip():
                continue
            
            prev_stripped = prev_line.strip()
            
            # Found a heading
            if prev_stripped.startswith('#'):
                base_indent = 0
                break
            
            # Found a properly formatted bullet
            if prev_stripped.startswith('-'):
                prev_indent = len(prev_line) - len(prev_line.lstrip())
                if prev_indent <= 6:
                    if leading_spaces > prev_indent + 1:
                        base_indent = min(prev_indent + 2, 6)
                    else:
                        base_indent = prev_indent
                    break
            
            # Found regular text
            prev_indent = len(prev_line) - len(prev_line.lstrip())
            if prev_indent <= 6:
                base_indent = prev_indent
                break
        
        # Limit to max 6 spaces
        base_indent = min(base_indent, 6)
        final_lines.append(' ' * base_indent + stripped + '\n')
    else:
        # Line already has reasonable indentation
        final_lines.append(line)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

print(f'Fixed frontmatter and indentation. Found {len(todos)} todos.')
