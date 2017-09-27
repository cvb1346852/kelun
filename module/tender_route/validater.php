<?php
$tenderRouteValidater =
<<<EOF
{
		rules : {
			from_location : {
				required : true
			},
			to_location : {
				required : true
			},
			price : {
				required : true
			},
			over_rate : {
				required : true
			},
			months : {
				required : true
			},
			ship_method : {
				required : true
			},
			carriage_type : {
				required : true
			},
			density : {
				required : true
			}
		},
		messages : {
		}
}
EOF;

