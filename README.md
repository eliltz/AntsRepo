# AntsRepo

Commands to send. singular Ant API 06.08.19

--> "f2"  --> will tell the ant to go 2 steps forward

--> "b3"  --> will tell the ant to go 3 steps backwards

--> "r4"  --> will tell the ant to turn right and will ignore the number. the number still needs to be there.

--> "l2"  --> will tell the ant to turn left and will ignore the number. the number still needs to be there.

--> "<"  --> will tell the ant to turn backwards and right and will ignore the number. the number still needs to be there.

--> ">"  --> will tell the ant to turn backwards and left and will ignore the number. the number still needs to be there.

--> "s2"  --> will tell the ant to stop



GET --> http://localhost:3000/api/ants/ - > to get the ants

PUT --> http://localhost:3000/api/ants/1 --> to update ant number 1. for the purposes of the demo, the call should contain this JSON body:

{
	"antCommandsArr":  ["f3"]
}
			
