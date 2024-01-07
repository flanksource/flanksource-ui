rm -rf output;
mkdir -p output
for old in *.svg;
  do rsvg-convert $old -h 32 -a -f svg -o output/$old;
done
mv output/*.svg .

# git checkout calico.svg mission-control.svg mission-control-logo.svg canary-checker.svg

