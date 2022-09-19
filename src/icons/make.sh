#!/bin/bash
echo "// this file is generated using make index.js" > index.js

for img in $(ls *.svg); do
  name=${img%.*};
  name=${name//-/_};
  echo  import  $name from '"'./$img'";'  >> index.js  ;
done

echo "export const Icons = {" >> index.js

for img in $( ls *.svg); do
  name=${img%.*};
  name=${name//-/_};
  echo  '  "'${img%.*}'"': $name,  >> index.js ;
done

echo "}" >> index.js
