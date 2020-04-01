#!/bin/bash
npm i;
source cfg.env;
args=("$@");

check_arg() {
    for arg in "${args[@]}"; do
        if [ $1 == $arg ]; then 
            return 1;
        fi
    done;
    return 0;
}

dependencies=("rmp_api" "timetable_api");

for i in ${!folders[@]};
do
    log=${folders[$i]}

    cd $log;
    #echo `pwd`;
    npm i
    cd ..
done


folders=("front_end" "authentication" "course_calendar" "dviz" "profile_conf" "waitlists" "course_evals");

for i in ${!folders[@]};
do
    log=${folders[$i]}

    cd $log;
    #echo `pwd`;
    npm i
    check_arg $log;
    if [ $? == 1 ]; then 
        echo "dev mode for $log"
        cd ..
        npx eslint --fix $log
        cd $log
        npm run dev&
    else 
        npm run prod&
    fi
    cd ..
done