#!/bin/bash
echo "// this file is generated using make index.js" >index.ts

# Function to check if a string matches a JavaScript keyword
# Parameters:
#   $1: The string to check
# Returns:
#   0 (success) if the string matches a JavaScript keyword
#   1 (failure) otherwise
function is_javascript_keyword() {
  local keyword=" $1 " # Add spaces around the keyword for exact matching

  # List of JavaScript keywords
  local javascript_keywords=(
    await break case catch class const continue debugger default delete do else enum export extends
    false finally for function if implements import in instanceof interface let new null package private
    protected public return super switch static this throw try true typeof var void while with yield
  )

  for js_keyword in "${javascript_keywords[@]}"; do
    if [[ "$keyword" == *" $js_keyword "* ]]; then
      return 0 # Match found
    fi
  done

  return 1 # No match found
}

for img in $(ls *.svg); do
  name=${img%.*}
  name=${name//-/_}
  if is_javascript_keyword "$name"; then
    name="${name}_icon"
  fi
  echo import $name from '"'./$img'";' >>index.ts
done

printf "\n" >>index.ts
echo "export const Icons = {" >>index.ts

for img in $(ls *.svg); do
  name=${img%.*}
  name=${name//-/_}
  if is_javascript_keyword "$name"; then
    name="${name}_icon"
  fi
  echo '  "'${img%.*}'"': $name, >>index.ts
done

echo "}" >>index.ts
