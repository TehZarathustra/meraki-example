<template>
	<div class="welcome">
		<div class="welcome__logo">
			<img :src="aboutLogo" alt="">
		</div>
		<div class="welcome__tap">Tap into uniqueness</div>
	</div>
</template>

<script>
import aboutLogo from './../logo-3.png';

export default {
	data () {
		return {
			aboutLogo: aboutLogo
		}
	}
}
</script>

<style lang='sass'>
	.welcome
		width: 600px
		margin: 0 auto
		padding: 12% 0
		display: flex
		box-sizing: border-box
		flex-wrap: wrap
		text-align: center
		align-items: center
		animation: 2s fadeInDelayed
		position: relative
		height: 100%
		&__logo
			width: 100%
			img
				width: 100%
		&__tap
			text-decoration: center
			width: 100%
			color: #000
			opacity: .5
			text-transform: uppercase
			font-family: 'Futura pt'
			font-size: 2.3em
			position: absolute
			bottom: 5%

	@keyframes fadeInDelayed
		0%
			opacity: 0
			transform: translateY(10px)
		30%
			opacity: 0
			transform: translateY(10px)
		100%
			opacity: 1
			transform: translateY(0)
</style>
