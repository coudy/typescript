set random_value=%random%

if "%1"=="outgoing" goto OUTGOING

c:\teamhub\TeamHub.exe pack -c %1 -o c:\temp\%1.dpk
\\CodeFlow\public\cf submit -dpk c:\temp\%1.dpk -codeFlowProject Strada -reviewers jsltcr
goto DONE


:OUTGOING
c:\teamhub\TeamHub.exe pack -c outgoing -tracked -o c:\temp\%random_value%.dpk
\\CodeFlow\public\cf submit -dpk c:\temp\%random_value%.dpk -codeFlowProject Strada -reviewers jsltcr
goto DONE

:DONE