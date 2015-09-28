<?php


if (isset($_FILES["file"]))
{
	$alert = 1;
	$ext_accepted = array('.mod1');
	$ext_uploaded = strrchr($_FILES["file"]["name"], '.');
	if (!in_array($ext_uploaded, $ext_accepted))
		echo 'Vous devez uploader un fichier de type mod1.';
	else
	{
		$rep = './';
		$file = basename($_FILES['file']['name']);
		if (move_uploaded_file($_FILES['file']['tmp_name'], $rep . $file))
		{
			$content_file = file_get_contents($file);
			if ($content_file == FALSE)
				echo "File's content error.";
			else
			{
				$i = 0;
				/*
				41 = )
				0 = \0
				48 a 57 = 0123456789
				40 = (
				32 = ' '
				44 =  ,
				10 = \n
				45 = -
				*/
				while (ord($content_file[$i]) != 0)
				{
					if (ord($content_file[$i]) == 10)
						$i++;
					else if (ord($content_file[$i]) == 45 || ord($content_file[$i]) == 32 || ord($content_file[$i]) == 44 || ord($content_file[$i]) == 40 || ord($content_file[$i]) == 41 || (ord($content_file[$i]) >= 48 && ord($content_file[$i]) <= 57))
					{
						if ((ord($content_file[$i]) == 40 || ord($content_file[$i]) == 44 || ord($content_file[$i]) == 45) && (ord($content_file[$i + 1]) <= 48 && ord($content_file[$i + 1]) >= 57))
						{
							echo "Bad file.";
							$alert = 0;
							break;
						}
						if (ord($content_file[$i]) == 41 && ord($content_file[$i + 1]) != 40)
						{
							if (ord($content_file[$i + 1]) == 10)
								$i++;
							else if (ord($content_file[$i + 1]) != 0)
							{
								echo "Bad file.";
								$alert = 0;
								break;
							}
						}
					}
					else
					{
						echo "Bad file.";
						$alert = 0;
						break;
					}
					$i++;
				}
				$array_points = explode(" ", $content_file);
				$content_file = implode($array_points);
				$array_points = explode("\n", $content_file);
				$content_file = implode($array_points);
				$array_points = explode("(", $content_file);
				$content_file = implode($array_points);
				$array_points = explode(")", $content_file);
				array_pop($array_points);
				foreach ($array_points as $value) { // on checke si y a pas trop de points dans le fichier
					$is_good = explode(",", $value);
					if (count($is_good) != 3) {
						echo "Bad file.";
						$alert = 0;
					}
				}
				if ($alert == 1) {
					$j = 0;
					$bool = 0;
					foreach ($array_points as $value)
					{
						$convert = explode(",", $value);
						$i = 0;
						if ($convert[0] > 0 && ($convert[1] > 50 - $convert[0]))
						{
							$convert[1] = 50 - $convert[0];
						}
						if ($convert[2] > 0 && ($convert[1] > 50 - $convert[2]))
						{
							$convert[1] = 50 - $convert[2];
						}


						if ($convert[0] < 0 && ($convert[1] > abs(-50 - $convert[0])))
						{
							$convert[1] = -50 - $convert[0];
							$convert[1] = abs($convert[1]);
						}
						if ($convert[2] < 0 && ($convert[1] > abs(-50 - $convert[2])))
						{

							$convert[1] = -50 - $convert[2];
							$convert[1] = abs($convert[1]);
						}


						if ($convert[1] < 0)
						{
							echo "Point < 0";
							$alert = 0;
						}
						while ($i <= 2) // on convertit les pts
						{
							if ($convert[$i] > 50)
							{
								echo "Point > 50";
								$alert = 0;
							}
							$i++;
						}
						$string_convert = implode(",", $convert);
						$array_convert[$j] = $string_convert;
						$j++;
					}
				}
				if ($alert == 1) { // alert a 1 = fichier valide
						$array_points = $array_convert;
				?><html style="margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%;">
				<canvas style="width: 100%; height: 100%;" id="renderCanvas"></canvas>
				<script src="webgl/babylon.1.14.js"></script>
				<script>
					var array_points_js = <?php echo json_encode($array_points);?>;
				</script>
				<script src="mod.js"></script>
				<script>
					runMod("renderCanvas");
				</script></html><?php }
			}
		}
		else
			echo 'Fail upload.';
	}
}
else
	echo "Error."

?>
