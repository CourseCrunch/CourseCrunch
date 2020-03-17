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

folders=("authentication" "course_calendar" "dviz" "front_end" "profile_conf" "waitlists" "course_evals");

for i in ${!folders[@]};
do
    log=${folders[$i]}

    cd $log;
    #echo `pwd`;
    npm i
    check_arg $log;
    if [ $? == 1 ]; then 
        npm i -S semantic-ui-react/event-stack
        npm i -S stardust-ui/react-component-event-listener
        npm i -S stardust-ui/react-component-ref
        npm i -S create-react-context
        npm i -S react-dom
        npm i -S react-popper
        npm i -S semantic-ui-react
        npm i -S nodemailer
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