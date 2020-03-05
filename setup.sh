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

folders=("authentication" "course_calendar" "dviz" "front_end" "profile_conf" "waitlists");

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
        echo "not"
        npm run prod&
    fi
    cd ..
done