#!/bin/bash
source cfg.env;
folders=("authentication" "course_calendar" "dviz" "front_end" "profile_conf" "waitlists");

for i in ${!folders[@]};
do
    log=${folders[$i]}

    # Warn stakeholders if recently saw > 5 errors
    cd $log;
    echo `pwd`;
    npm i
    npm run prod&
    cd ..
done