<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Leave the above for bootstrap -->

	<title>Home | Justin Mulvaney</title>
	<meta name="description" content="Justin Mulvaney is a self-proclaimed musician and nerd.">
	
	<!--styles go here-->
	<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
	<link href='https://fonts.googleapis.com/css?family=Roboto:400,700|Lato:400,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/responsive.css">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- Google Analytics Tracking-->
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-61235697-2', 'auto');
	  ga('send', 'pageview');
	</script>
</head>

<body>

	<?php include "assets/header.php" ?>

	<div class="container-fluid">
		<div class="row-fluid">
			<div class="col-md-6 text-center">
				<img src="assets/images/crystalpic.png" id="profile-photo" title="Photo of Justin Mulvaney" alt="Photo of Justin Mulvaney">
			</div>
			<div class="col-md-6 text-center">
				<h1 id="name">Hey, I'm Justin.</h1>
				<h2 id="intro">I play <a href="music" id="music">Music</a> and work at <a href="https://www.crystalknows.com/" target="_blank" id="crystal">Crystal</a>.<br><br>I also like to read a lot of <a href="books" id="book-link">Books</a> and <a href="http://www.justinmulvaney.com/blog" id="blog-link">Write</a>.</h2>
			</div>
		</div>	
	</div>

	<?php include "assets/footer.php"; ?>

</body>
</html>