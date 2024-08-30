#!/bin/bash

if [ -z "$1" ]; then
  echo "Enter the number of repetitions as the first argument"
  exit 1
fi

COUNT=$1

if [ -z "$2" ]; then
  echo "Enter the filename as the second argument!"
  exit 1
fi

FILE=$2

TEXT_FILE="exampleSQL.txt"

> $FILE

for ((i=1; i<=COUNT; i++))
do
    sed "s/\$i/$i/g" $TEXT_FILE >> $FILE
done

echo "File $FILE was created and filled $COUNT rows."
