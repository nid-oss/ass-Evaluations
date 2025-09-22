const Api = (() => {
    const url = 'http://localhost:4232/courseList';
    const course_data = fetch(url).then((res) => res.json());
    return  {course_data};
})();

const View = (() => {
    const domStr = {
        avaliable_courses: '.avaliable-courses',
        selected_courses: '.selected-courses'
    }

    const creatTemp = (arr) => {
        let temp = '<h4>Avaliable Courses</h4>'
        let isRequired ='';
        arr.forEach((course) => {
            if(course.required === true) {
                isRequired = "Compulsory"
            }else{
                isRequired = "Elective"
            }
            temp = `<li class="dynamic-list-item" data-credit="${course.credit}">${course.courseName}<br>Course Type: ${isRequired}<br>Course Credit: ${course.credit}</li>`;
        })

        return temp;
    }

    const render = (element,temp) => {
        element.innerHTML = temp
    }

    return {
        domStr,
        creatTemp,
        render
    }
})();

const Model = ((view,api) => {
    const{domStr, creatTemp , render} = view;
    const{course_data} = api;

    class State {
        constructor(){
            this._courseList = []
        }

        getCourseList() {
            return this._courseList
        }

        setCourseList(arr) {
            this_courseList = arr
            const DOM_Element = document.querySelector(domStr.avaliable_courses)
            const temp = creatTemp(this_courseList)
            render(DOM_Element,temp)
        }
    }
    return {
        course_data,
        State
    }
})(View,Api)

const Controller = ((view,model) => {
     const {domStr,creatTemp,render} = view;
     const { course_data, State } = model

     const newState = new State()
     const init = () => {
        course_data.then(data => newState.setCourseList(data));
     } 
     
     const updateTotalCredit = () => {
        const totalCreditElement = document.querySelector('h2');
        const selectedCourses = document.querySelector('.dynamic-list-item.selected');

        let totalCredit =0;
        selectedCourses.forEach(course => {
            totalCredit += parseInt(course.dataset.credit);
        });

        totalCreditElement.textContent = 'Total Credit: ${totalCredit}';

        if(totalCredit > 18){
            alert("You can not choose more than 18 Credit in one Semester!");
        }

        return totalCredit;
     }

     const toogleCourseSelection = () => {
        document.addEventListener('Click', (event) => {
            const target = event.target;
            if(target.classList.contains('dynamic-list-item')) {
                target.classList.toogle('selected');
                updateTotalCredit();

                if(target.classList.contains('selected')) {
                    target.style.backgroundColor = 'cornflowerblue';
                }else {
                    target.style.backgroundColor ='';
                }
            }
        });
     }
     
     document.addEventListener('DOMContentLoaded', () => {
        toogleCourseSelection();
     });
      
      const addCourse = () => {
        const selectButton = document.getElementById('selectButton');

        selectButton.addEventListener('click', () => {
            const totalCredit = updateTotalCredit();

            if (totalCredit > 18) {
                alert("You cannot choose more than 18 credits in one semester!");
            } else {
                const confirmation = confirm(`You have chosen ${totalCredit} credits for this semester. You cannot unselect once you submit. Do you want to confirm?`);
                if (confirmation) {
                    showSelectedCourses();
                    selectButton.disabled = true;
                }
            }
        });
    }


    const showSelectedCourses = () => {
         const selectedCourses = document.querySelectorAll('.dynamic-list-item.selected');
         const selectedCoursesList = document.querySelector(domStr.selected_courses + ' ul');

         selectedCoursesList.innerHTML = '';

          selectedCourses.forEach(course => {
            const newCourseItem = document.createElement('li');
            newCourseItem.innerHTML = course.innerHTML;
            selectedCoursesList.appendChild(newCourseItem);
        });
        
    }

    const bootstrap = () => {
        init()
        addCourse()
    }

    return {
        bootstrap
    }

})(View,Model) 

Controller.bootstrap() 