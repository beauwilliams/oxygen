#!/usr/bin/env python3
"""Normalize indentation throughout the plan file."""

file_path = '.cursor/plans/oxygen_specification_management_system_-_complete_implementation_plan_0ce2ff8b.plan.md'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

final_lines = []
in_code_block = False
bullet_stack = []  # Track bullet indentation levels

for i, line in enumerate(lines):
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
    
    # Headings - no indentation, reset bullet stack
    if stripped.startswith('#'):
        bullet_stack = []
        final_lines.append(stripped + '\n' if not line.endswith('\n') else stripped)
        continue
    
    # Bullet points - normalize to 0, 2, 4, 6 spaces
    if stripped.startswith('-'):
        if leading_spaces > 6:
            # Determine proper indentation
            if bullet_stack:
                last_indent = bullet_stack[-1]
                # If significantly more indented than last, it's nested
                if leading_spaces > last_indent + 1:
                    new_indent = min(last_indent + 2, 6)
                else:
                    # Same level or less - pop until we find right level
                    new_indent = last_indent
                    while bullet_stack and bullet_stack[-1] >= new_indent:
                        bullet_stack.pop()
                    if not bullet_stack or bullet_stack[-1] < new_indent:
                        bullet_stack.append(new_indent)
            else:
                # First bullet - use 0 or 2
                new_indent = 0 if leading_spaces < 2 else 2
                bullet_stack.append(new_indent)
            
            # Update stack
            if bullet_stack and bullet_stack[-1] != new_indent:
                if new_indent > (bullet_stack[-1] if bullet_stack else 0):
                    bullet_stack.append(new_indent)
                else:
                    while bullet_stack and bullet_stack[-1] > new_indent:
                        bullet_stack.pop()
                    if not bullet_stack or bullet_stack[-1] < new_indent:
                        bullet_stack.append(new_indent)
            
            final_lines.append(' ' * new_indent + stripped + '\n')
        else:
            # Already reasonable indentation
            current_indent = leading_spaces
            # Update bullet stack
            if bullet_stack:
                if current_indent > bullet_stack[-1]:
                    bullet_stack.append(current_indent)
                elif current_indent < bullet_stack[-1]:
                    while bullet_stack and bullet_stack[-1] > current_indent:
                        bullet_stack.pop()
            else:
                bullet_stack.append(current_indent)
            final_lines.append(line)
    else:
        # Regular text - normalize excessive indentation
        if leading_spaces > 6:
            # Use indentation from last bullet or 0
            if bullet_stack:
                new_indent = min(bullet_stack[-1] + 2, 6)
            else:
                new_indent = 0
            final_lines.append(' ' * new_indent + stripped + '\n')
        else:
            final_lines.append(line)

# Second pass: fix nested bullets that should be at same level
# Look for patterns where bullets are nested when they shouldn't be
fixed_final = []
in_code_block = False
for i, line in enumerate(final_lines):
    if line.strip().startswith('```'):
        in_code_block = not in_code_block
        fixed_final.append(line)
        continue
    
    if in_code_block:
        fixed_final.append(line)
        continue
    
    if not line.strip():
        fixed_final.append(line)
        continue
    
    stripped = line.strip()
    leading_spaces = len(line) - len(line.lstrip())
    
    # For bullets, check if they should be at same level as previous
    if stripped.startswith('-') and leading_spaces > 0:
        # Look back for previous bullet
        for j in range(len(fixed_final) - 1, -1, -1):
            prev = fixed_final[j]
            if not prev.strip():
                continue
            if prev.strip().startswith('-'):
                prev_indent = len(prev) - len(prev.lstrip())
                # If current is only slightly more indented (2-4 spaces difference), 
                # and content suggests same level, use same indent
                if 2 <= (leading_spaces - prev_indent) <= 4:
                    # Check if content suggests it's a continuation/sub-item
                    # For now, keep as is - the excessive nesting is already fixed
                    pass
                break
    
    fixed_final.append(line)

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(fixed_final)

print('Normalized indentation throughout document')
