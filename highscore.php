<?php

function bubbleSort($array) {
	$array_size = count($array);
	for ( $i = 0; $i < $array_size; $i++ )
	{
		for ($j = 0; $j < $array_size; $j++ )
		{
			if ($array[$i]['score'] > $array[$j]['score'])
			{
				$temp = $array[$i];
				$array[$i] = $array[$j];
				$array[$j] = $temp;
			}
		}
	}
	return $array;
}

if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
		strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest'){

	/* Own highscores ***
	 */
	/* get all variables*/
	$username   = $_POST['username'];
	$score      = intval($_POST['score']);
	$jsonFile   = 'highscores.json';
	$json       = file_get_contents($jsonFile);
	$scoresArr  = json_decode($json, true);
	$date       = getdate();
	$formatDate = $date[year]  .'/'. $date[mon]     .'/'. $date[mday]    .'|'.
			      $date[hours] .':'. $date[minutes] .':'. $date[seconds];



	/* check if $scoresArr['user'][$username] isset*/
	if(!isset($scoresArr['user'][$username])){
		$scoresArr['user'][$username] = array();
	}

	/* push the new date and score into the array */
	array_push($scoresArr['user'][$username],
			   array('date'=> $formatDate, 'score'=> $score));

	/* sort the array after the score */
	$scoresArr['user'][$username] = bubbleSort($scoresArr['user'][$username]);



	/* TOP 20 ***
	 */
	/* push the new date, name and score into the array */
	array_push($scoresArr['top20'],
		array('name'=> $username, 'date'=> $formatDate, 'score'=> $score));

	/* sort the array after the score */
	$scoresArr['top20'] = bubbleSort($scoresArr['top20']);
	/* check if top20 has 21 values */
	if(count($scoresArr['top20']) == 21){
		unset($scoresArr['top20'][20]);
	}

	/* put the json array into the highscore-file */
	$jsonReturn = json_encode($scoresArr);
	file_put_contents($jsonFile, $jsonReturn);
	echo $jsonReturn;
} else {
	var_dump('KEIn AJAAX');
}
/*
{
"user":{
	"marlon" : [
		{
			"date" : "asfasf",
			"score" : 40
		},
		{
			"date" : "asfasfs",
			"score" : 20
		}
	],
	"dennis" : [
		{
			"date" : "asfasdaseasf",
			"score" : 500
		},
		{
			"date" : "trz",
			"score" : 30
		}
	]
},
"top20":[
	{
		"name" : "marlon",
		"date" : "asfasfs",
		"score" : 500
	},
	{
		"date" : "trz",
		"date" : "asfasf",
		"score" : 260
	}
]
}

  */