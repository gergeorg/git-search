const app = document.querySelector('.container')

function createElem (elemTag, elemClass) {
	const elem = document.createElement(elemTag)

	if(elemClass) elem.classList.add(elemClass)
	return elem
}

const debounce = (fn, debounceTime) => {
	let timerId
	return function (){
		clearTimeout(timerId)
		timerId = setTimeout(() => {
			fn.apply(this, arguments)
		}, debounceTime);
	};
};


	const fragment = document.createDocumentFragment()
	const inputWrapper = createElem('div', 'input-wrapper')
	const input = createElem('input', 'input__search')
	const inputList = createElem('ul', 'input__list')
	const favList = createElem('ul', 'list')

	input.setAttribute('type', 'search')
	input.setAttribute('placeholder', 'Search')

	inputWrapper.appendChild(input)
	fragment.appendChild(inputWrapper)
	fragment.appendChild(inputList)
	fragment.appendChild(favList)
	app.appendChild(fragment)



async function searchRepo() {
	const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`)

	let data = await response.json();
	let reposArr = data.items;


	for ( let i = 0; i < 5; i++) {
		const inputItem = createElem('li', 'input__item')
		inputItem.innerText = reposArr[i].name;
		inputList.appendChild(inputItem)
		inputItem.addEventListener('click', () => {
			createFavorite(reposArr[i].name, reposArr[i].owner.login, reposArr[i].stargazers_count, reposArr[i].id);
			input.value = '';
			inputList.innerHTML = '';
		})
	}

}

function createFavorite(name, owner, stars, id) {
	const favoriteItem = createElem('li', 'list__item');

	favoriteItem.id = id;
	const favoriteWrapper = createElem('div', 'list__item-wrapper');
	const favoriteName = createElem('p');
	const favoriteOwner = createElem('p');
	const favoriteStars = createElem('p');
	const favoriteDel = createElem('button', 'list__btn');

	favoriteName.innerHTML = `Name: ${name}`;
	favoriteOwner.innerHTML = `Owner: ${owner}`;
	favoriteStars.innerHTML = `Stars: ${stars}`;

	favList.appendChild(favoriteItem)

	favoriteItem.appendChild(favoriteWrapper);
	favoriteWrapper.appendChild(favoriteName);
	favoriteWrapper.appendChild(favoriteOwner);
	favoriteWrapper.appendChild(favoriteStars);

	favoriteItem.append(favoriteDel);

	favoriteDel.addEventListener('click', (e) => {

		document.getElementById(id).remove()
	})
};


const fn = () => {
	searchRepo();
};

const debouncedFn = debounce(fn, 500);
input.addEventListener('input', debouncedFn);
