<script lang="ts">
   const pinwheel = '/pinwheel.svg';
</script>
<style>
#appbar-lunalogo {
   width: 50px;
   height: 50px;
   transition: transform 1s ease;
   opacity: 0.9;
}
#appbar-lunalogo:hover {
   transform: rotate(180deg) scale(1.1);
   opacity: 1;
}
</style>
<img id="appbar-lunalogo" src={pinwheel} alt="Luna - Satellite Imagery Platform" class="animate-fadeIn" />