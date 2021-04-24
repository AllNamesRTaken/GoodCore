import {diff} from './src/lib/Obj'

const base = {
	name: 'joel',
	age: '41',
	hobbies: ['coding', 'rpg', 'dancing'],
	work: {
		name: 'unit4',
		years: 14,
	},
	family: [
		{
			name: 'anne',
			age: '39',
			hobbies: ['yoga', 'dancing', 'gardening'],
			work: {
				name: 'amatango',
				years: 8,
			},
		},
		{
			name: 'joshua',
			age: '7',
			hobbies: ['lego', 'minecraft', 'reading'],
			work: {
				name: 'school',
				years: 1,
			},
		},
		{
			name: 'eliah',
			age: '5',
			hobbies: ['ninjago', 'acrobatics', 'lego'],
			work: {
				name: 'kindergarden',
				years: 4,
			},
		},
		{
			name: 'Emelie',
			age: '2',
			hobbies: ['hoppa'],
			work: {
				name: 'kindergarden',
				years: 1,
			},
		}
	]
}
const target = {
	name: 'Joel',
	age: '41',
	hobbies: ['coding', 'rpg', 'dancing'],
	work: {
		name: 'unit4',
		years: 15,
	},
	family: [
		{
			name: 'Anne',
			age: '39',
			hobbies: ['yoga', 'dancing', 'gardening', 'riding'],
			work: {
				name: 'amatango',
				years: 8,
			},
		},
		{
			name: 'Joshua',
			age: '7',
			hobbies: ['lego', 'minecraft', 'reading'],
			work: {
				name: 'school',
				years: 1,
			},
		},
		{
			name: 'Elia',
			age: '5',
			hobbies: ['ninjago', 'acrobatics', 'lego'],
			work: {
				name: 'preschool',
				years: 4,
			},
		},
		{
			name: 'Emelie',
			age: '2',
			hobbies: ['hoppa'],
			work: {
				name: 'kindergarden',
				years: 1,
			},
		}
	]
}

console.log("P", diff(target, base))