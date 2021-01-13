BoardManager();
NavigationBoard();
OpenModalWindow();
HeaderActions();

function BoardManager() {
    SwitcherContent();
    UserItemsManager();
    NewUserItemsManager();

    let dropdown = new DropdownManager();
    dropdown.InitDropdowns();

    function DropdownManager() {
        let that = this;
        let lastOpenedRole;

        this.InitDropdowns = function() {
            let selectHeader = document.querySelectorAll('.select__header');
            let selectItem = document.querySelectorAll('.select__item');


            for (let i = 0; i < selectHeader.length; i++) {

                selectHeader[i].onclick = selectToggle;

                function selectToggle() {
                    let parentHeader = this.parentNode;

                    parentHeader.querySelector('.select__icon').classList.toggle('rotateIcon');
                    parentHeader.classList.toggle('is-active');

                    that.DisableLastOpened(parentHeader);
                }
            }

            for (let i = 0; i < selectItem.length; i++) {

                selectItem[i].onclick = selectChoose;

                function selectChoose() {
                    let text = this.innerText,
                    select = this.closest('.select'),
                    currentText = select.querySelector('.select__current');

                    select.classList.remove('is-active');
                    currentText.innerHTML = text;

                    lastOpenedRole.querySelector('.select__icon').classList.remove('rotateIcon');
                }
            }
        }

        this.DisableLastOpened = function(newSelectRole) {
            if(lastOpenedRole != null && newSelectRole != lastOpenedRole) {
                lastOpenedRole.classList.remove('is-active');
                lastOpenedRole.querySelector('.select__icon').classList.remove('rotateIcon');
            }
            lastOpenedRole = newSelectRole;
        }
    }

    function SwitcherContent() {
        let contents = document.querySelector('.invite-board__container').children;
        let tabs = contents[0].querySelectorAll('.invite-board__tabs_item');
        let currentTabs = tabs[0];
        let currentContent = contents[1];

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                SwitchContent(i);
                SwitchTabs(i);

                DisableAllTooltips();
            })
        }

        function SwitchContent(index) {
            currentContent.classList.remove('isActiveInviteBoard');
            currentContent = contents[index + 1];
            currentContent.classList.add('isActiveInviteBoard');
        }

        function SwitchTabs(index) {
            currentTabs.classList.remove('isActiveTab');
            currentTabs = tabs[index];
            currentTabs.classList.add('isActiveTab');
        }
    }

    function DisableAllTooltips() {
        let tooltips = document.querySelectorAll('.isActiveTooltip');

        for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].classList.remove('isActiveTooltip');
        }
    }

    function UserItemsManager() {
        SortAZButton();
        EditInputInfo();
        EditStatus();
        EditButton();
        RemoveItem();

        function SortAZButton() {
            let buttons = document.querySelectorAll('.filter__name');

            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function () {
                    buttons[i].classList.toggle('isActiveAlphabetically');
                });
            }
        }

        function EditInputInfo() {
            initInput('name');
            initInput('email');

            function initInput(type) {
                let valInput =  document.querySelectorAll('.users__item-editor_input-' + type);

                for (let i = 0; i < valInput.length; i++) {
                    let item = valInput[i];
                    let itemHeader = item.closest('.users__wrapper');
                    let usersInfo = itemHeader.querySelector('.users__info_' + type);
                    item.value = usersInfo.innerText;

                    item.addEventListener('input', changeText);

                    function changeText() {
                        usersInfo.innerHTML = item.value;
                    }
                }
            }
        }

        function EditStatus() {
            const statusClasses = ['statusInvited', 'statusActive'];
            let usersSelect = document.querySelectorAll('.users__select select');

            for (let i = 0; i < usersSelect.length; i++) {
                let item = usersSelect[i];
                let infoStatus = item.closest('.users__wrapper').querySelector('.users__info_status');

                ApplyStatusToSelect();
                usersSelect[i].addEventListener('change', changeStatus);

                function ApplyStatusToSelect() {
                    let typeStatusText = infoStatus.getAttribute('class').replace('users__info_status ', '');
                    let index = statusClasses.indexOf(typeStatusText);
                    item.querySelectorAll('option')[index].selected = 'selected';
                }

                function changeStatus() {
                    infoStatus.setAttribute('class', 'users__info_status');
                    infoStatus.classList.add(statusClasses[item.value]);
                }
            }
        }

        function EditButton() {
            let usersEdit = document.querySelectorAll('.users__edit');

            for (let i = 0; i < usersEdit.length; i++) {
                let item = usersEdit[i].closest('.users__item');
                let usersInfo = item.querySelector('.users__info');
                let usersEditor = item.querySelector('.users__item-editor_wrapper');
                usersInfo.style.display = 'flex';

                CopyTextTo(usersInfo.parentNode, '.users__info_role', '.select__current');

                usersEdit[i].addEventListener('click', toggleEdit);

                function toggleEdit() {
                    let isShowEditor = usersInfo.style.display == 'flex';
                    usersEdit[i].classList.toggle('isActiveCheck');

                    CopyTextTo(usersInfo.parentNode, '.select__current', '.users__info_role');

                    if (isShowEditor) switchVisivble('none', 'flex');
                    else switchVisivble('flex', 'none');

                    function switchVisivble(infoDisplay, editorDisplay) {
                        usersInfo.style.display = infoDisplay;
                        usersEditor.style.display = editorDisplay;
                    }
                }
            }
        }

        function CopyTextTo(nodeParent, fromClassName, toClassName) {
            nodeParent.querySelector(toClassName).innerText = nodeParent.querySelector(fromClassName).innerText;
        }

        function RemoveItem() {
            let usersDel = document.querySelectorAll('.users__del');

            for (let i = 0; i < usersDel.length; i++) {
                let item = usersDel[i];
                let users = item.closest('.users');

                usersDel[i].addEventListener('click', changeStatus);

                function changeStatus() {
                    users.remove();
                }
            }
        }
    }

    function NewUserItemsManager() {
        AddItemButton();
        RemoveUserItem();

        function AddItemButton() {
            let inviteUser = document.querySelector('.invite-user');
            let button = inviteUser.querySelector('.invite-user__add-item');
            let content = inviteUser.querySelector('.invite-user__inner-content');
            let original = inviteUser.querySelector('.invite-user__item');
            let cloneItem = original.cloneNode(true);

            button.addEventListener('click', addItem);
            original.querySelector('input').addEventListener('invalid', invalide);

            function addItem() {
                let inputs = document.querySelectorAll('.invite-user__input');
                let valid = true;

                for (let i = 0; i < inputs.length; i++) {
                    let input = inputs[i];

                    if (input.value == '' || !input.value.match('@.')) {
                        let inputParent = input.parentNode;

                        valid = false;
                        StatrAnimation(inputParent);
                    }
                }

                if (valid) {
                    let cloned = cloneItem.cloneNode(true);

                    content.appendChild(cloned);
                    cloned.querySelector('input').oninvalid = invalide;
                    dropdown.InitDropdowns();
                    dropdown.DisableLastOpened();
                    RemoveUserItem();
                }
            }

            function StatrAnimation(inputParent) {
                inputParent.classList.remove('isActiveTooltip');
                void inputParent.offsetWidth;
                inputParent.classList.add('isActiveTooltip');
            }

            function invalide(e) {
                e.preventDefault();
                let inputParent = this.parentNode;

                StatrAnimation(inputParent);
            }
        }

        function RemoveUserItem() {
            let inviteUserItem = document.querySelectorAll('.invite-user__item_remove');
        
            for (let i = 0; i < inviteUserItem.length; i++) {
                let item = inviteUserItem[i];
                let userItem = item.parentNode;
        
                item.addEventListener('click', function () {
                    userItem.remove();
                })
            }
        }
    }
}

function NavigationBoard() {
    let disclosureNavigation = new ControlMenu();
    let controlSubmenu = new ControlSubmenu();
    
    ManagementActive();
    
    function ControlMenu() {
        let that = this;
        let headerBurger = document.querySelector('.header__burger');
        let navigationList = document.querySelector('.navigation__list');
        let navIcon = document.querySelector('.navigation__icon-items');
        let inviteBoard = document.querySelector('.invite-board');

        let hideWidth = navIcon.offsetWidth;
        let parentNavigation = navigationList.parentNode;
        let showWidth = navigationList.offsetWidth;
    
        inviteBoard.style.marginLeft = hideWidth + 'px';
    
        headerBurger.addEventListener('click', ToggleMenu);
    
        function ToggleMenu() {
            that.Enable(parentNavigation.offsetWidth < showWidth);
            controlSubmenu.Enable(true);
        }
        
        this.Enable = function(isShow) {
            let width = isShow ? showWidth : hideWidth;

            parentNavigation.style.width = width + 'px';
            inviteBoard.style.marginLeft = width + 'px';

            if(isShow) headerBurger.classList.add('burger-active');
            else headerBurger.classList.remove('burger-active');
        }
    }

    function ControlSubmenu() {
        let that = this;
        let navigation = document.querySelector('.navigation');
        let navInner = navigation.querySelector('.navigation__list_items-inner');
        let itemArrow = navigation.querySelector('.navigation__list_items-arrow');
        let navHeader = navigation.querySelector('.navigation__header');
        let navFooter = navigation.querySelector('.navigation__footer');
        let headerHeight = navHeader.offsetHeight;
        let footerHeight = navFooter.offsetHeight;

        navHeader.addEventListener('click', Toggle);
        
        function Toggle() {
            that.Enable(navInner.offsetHeight > headerHeight);
            disclosureNavigation.Enable(true);
        }
        
        this.Enable = function(isHide) {
            navInner.style.height = (isHide ? headerHeight : headerHeight + footerHeight) +'px';
            if(isHide) itemArrow.classList.remove('rotateIcon');
            else itemArrow.classList.add('rotateIcon');
        }
    }
    
    function ManagementActive() {
        let manage = document.querySelector('.manage');
        let workflows = document.querySelector('.workflows');
        let user = document.querySelector('.user');
        
        manage.addEventListener('click', function () {
            ChangeContent('block', 'none', 'none');
        });
        
        workflows.addEventListener('click', function () {
            ChangeContent('none', 'block', 'none');
        });
        
        user.addEventListener('click', function () {
            ChangeContent('none', 'none', 'block');
        });
        
        function ChangeContent(manageUse, workUse, inviteUse) {
            let management = document.querySelector('.management');
            let inviteContainer = document.querySelector('.invite-board__container');
            let tableWorkflows = document.querySelector('.table-workflows');
            
            management.style.display = manageUse;
            tableWorkflows.style.display = workUse; 
            inviteContainer.style.display = inviteUse;
        }
    }
}

function OpenModalWindow() {
    UserMenuHeader();
    
    function UserMenuHeader() {
        let user = document.querySelector('.header__headline_user');
        let userMenu = document.querySelector('.usermenu');
    
        user.addEventListener('click', function() {
            showPanel();
        });
    
        function showPanel() {
            visibleLocation('1', 'visible');
    
            document.body.addEventListener('click', eventHideLocation);
        }
    
        function eventHideLocation(e) {
            if(!e.target.classList.contains('header__headline_user') && !e.target.closest('.usermenu')) {
                hidePanel();
            }
        }
    
        function hidePanel() {
            visibleLocation('0', 'none');
    
            document.body.removeEventListener('click', eventHideLocation);
        }
    
        function visibleLocation(opacity, pointerEvents) {
            userMenu.style.opacity = opacity;
            userMenu.style.pointerEvents = pointerEvents;
        }
    }

    ModalWindowManage();

    function ModalWindowManage() {
        let tableItem = document.querySelectorAll('.table__content');
        let wndowManage = document.querySelector('.window-manage');

        for (let i = 0; i < tableItem.length; i++) {
            let item = tableItem[i];
            
            item.addEventListener('click', function() {
                showPanel();
            });
        }
        
        function showPanel() {
            visibleLocation('translateX(-15px)');
        
            document.body.addEventListener('click', eventHideLocation);
        }
        
        function eventHideLocation(e) {
            if(!e.target.classList.contains('table__content') && !e.target.closest('.window-manage')) {
                hidePanel();
            }
        }
        
        function hidePanel() {
            visibleLocation('translateX(342px)');
        
            document.body.removeEventListener('click', eventHideLocation);
        }
        
        function visibleLocation(translate) {
            wndowManage.style.transform = translate;
        }
    }

    ModalWindowWorkflows();

    function ModalWindowWorkflows() {
        let tableItem = document.querySelectorAll('.table-workflows__item_info');
        let windowWorkFlows = document.querySelector('.window-workFlows');

        for (let i = 0; i < tableItem.length; i++) {
            let item = tableItem[i];
            
            item.addEventListener('click', function () {
                showPanel();
            });
        }

        function showPanel() {
            visibleLocation('translateX(0)');
        
            document.body.addEventListener('click', eventHideLocation);
        }
        
        function eventHideLocation(e) {
            if(!e.target.classList.contains('table-workflows__item_info') && !e.target.closest('.window-workFlows')) {
                hidePanel();
            }
        }
        
        function hidePanel() {
            visibleLocation('translateX(407px)');
        
            document.body.removeEventListener('click', eventHideLocation);
        }
        
        function visibleLocation(translate) {
            windowWorkFlows.style.transform = translate;
        }
    }
}

function HeaderActions() {
    ControlHeaderMode();
    TogglePhone();
    ActiveCalendar();

    function ControlHeaderMode() {
        let modeItem = document.querySelectorAll('.header__mode_item');
        let modeElem = document.querySelector('.header__mode_elem');

        for (let i = 0; i < modeItem.length; i++) {
            let item = modeItem[i];

            item.addEventListener('click',  function () {
                let attrSelectItem = item.getAttribute('class').replace('header__mode_item ','');
                let selectText = item.innerText;
                
                modeElem.setAttribute('class', 'header__mode_elem');
                modeElem.classList.add(attrSelectItem);
                modeElem.innerHTML = selectText;
                item.parentNode.style.display = 'none';
            });
        }

        modeElem.addEventListener('click', function () {
            let modeWrapper = document.querySelector('.header__mode-wrapper');
            
            modeWrapper.style.display = 'block';
        });
    }

    function TogglePhone() {
        let headerPhone = document.querySelector('.header__phone');

        headerPhone.addEventListener('click', function () {
            headerPhone.classList.toggle('phoneActive');
        });
    }

    function ActiveCalendar() {
        let headerCalendar = document.querySelector('.header__calendar');
        let calendar = document.querySelector('#calendar');

        headerCalendar.addEventListener('click', function () {
            calendar.classList.toggle('calendarVisible');
        });
    }
}

// DraggingItem();

// function DraggingItem() {
//     let itemBoard = document.querySelectorAll('.item-board');

//     for (let i = 0; i < itemBoard.length; i++) {
//         let item = itemBoard[i];
        
//         item.addEventListener('dragend', function (e) {
//             item.style.top = e.pageX + 'px';
//             item.style.left = e.pagey + 'px';
//         })
//     }
// }





















function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }
});
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
function calendar(id, year, month) {
    var Dlast = new Date(year,month+1,0).getDate(),
        D = new Date(year,month,Dlast),
        DNlast = new Date(D.getFullYear(),D.getMonth(),Dlast).getDay(),
        DNfirst = new Date(D.getFullYear(),D.getMonth(),1).getDay(),
        calendar = '<tr>',
        month=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    if (DNfirst != 0) {
      for(var  i = 1; i < DNfirst; i++) calendar += '<td>';
    }else{
      for(var  i = 0; i < 6; i++) calendar += '<td>';
    }
    for(var  i = 1; i <= Dlast; i++) {
      if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
        calendar += '<td class="today">' + i;
      }else{
        calendar += '<td>' + i;
      }
      if (new Date(D.getFullYear(),D.getMonth(),i).getDay() == 0) {
        calendar += '<tr>';
      }
    }
    for(var  i = DNlast; i < 7; i++) calendar += '<td>&nbsp;';
    document.querySelector('#'+id+' tbody').innerHTML = calendar;
    document.querySelector('#'+id+' thead td:nth-child(2)').innerHTML = month[D.getMonth()] +' '+ D.getFullYear();
    document.querySelector('#'+id+' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#'+id+' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
        document.querySelector('#'+id+' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
    }
}
calendar("calendar", new Date().getFullYear(), new Date().getMonth());
// переключатель минус месяц
document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month)-1);
}
// переключатель плюс месяц
document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month)+1);
}